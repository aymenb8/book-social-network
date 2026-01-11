import {Component, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';

@Component({
  selector: 'app-return-books',
  imports: [],
  templateUrl: './return-books.html',
  styleUrl: './return-books.scss'
})
export class ReturnBooks implements OnInit{
  returnedBooks = signal<PageResponseBorrowedBookResponse>({});
  page: number = 0;
  size: number = 5;
  message = signal('');
  level: string = 'success';

  constructor(
    private bookService: BookService
  ){
  }

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }


  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).then((resp) => {
      this.returnedBooks.set(resp);
    })
  }


  protected gotToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  protected gotToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  protected gotToPage(index: number) {
    this.page = index;
    this.findAllReturnedBooks();
  }

  protected gotToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  protected gotToLastPage() {
    this.page = this.returnedBooks().totalPages as number - 1;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.returnedBooks().totalPages as number - 1;
  }

  protected approveBookReturn(book: BorrowedBookResponse) {
      if(!book.returned){
        this.level = 'error';
        this.message.set("The book is not yet returned");
        return;
      }
      this.bookService.approveReturnBorrowedBook({
        'book-id': book.id as number
      }).then(() => {
        this.level = 'success';
        this.message.set("Book return approved");
        this.findAllReturnedBooks();
      }).catch((err) => {
        this.level = 'error';
        this.message.set(err.error.error);
      });
  }
}
