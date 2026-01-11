import {Component, OnInit, signal} from '@angular/core';
import {BookRequest} from '../../../../services/models/book-request';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BookService} from '../../../../services/services/book.service';


@Component({
  selector: 'app-manage-book',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss'
})
export class ManageBook implements OnInit{

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  errorMsg = signal<string[]>([]);
  selectedPicture = signal<string>('https://voir-plus.com/wp-content/uploads/2020/01/Inetrnet-00.jpg')
  selectedBookCover= signal<any>(null);
  bookRequest= signal<BookRequest>({authorName: "", isbn: "", synopsis: "", title: ""});

  ngOnInit(): void {
        const bookId = this.activatedRoute.snapshot.params['bookId'];
        if(bookId){
          this.bookService.findBookById({
            'book-id': bookId
          }).then((book) => {
            this.bookRequest.set({
              id: book.id,
              title: book.title as string,
              authorName: book.authorName as string,
              isbn: book.isbn as string,
              synopsis: book.synopsis as string,
              shareable: book.shareable as boolean
            });
            if(book.cover){
              this.selectedPicture.set('data:image/jpg;base64,' + book.cover)
            }
          });
        }
    }



  protected onFileSelected(event: any) {
      this.selectedBookCover.set(event.target.files[0]);
    if (this.selectedBookCover()) {
      const reader:FileReader = new FileReader();
      reader.onload = () => {
        this.selectedPicture.set(reader.result as string);
      }
      reader.readAsDataURL(this.selectedBookCover());
    }
  }

  saveBook() {
    this.bookService.saveBook({
      body: this.bookRequest()
    }).then((bookId) => {
      this.bookService.uploadBookCoverPicture({
        'book-id': bookId,
        body: {
          file: this.selectedBookCover()
        }
      }).then(() => this.router.navigateByUrl('/books/my-books'));
    }).catch(err => {
      this.errorMsg.set(err.error.validationErrors);
    })
  }
}
