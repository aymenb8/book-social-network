import {Component, OnInit, signal} from '@angular/core';
import {BookCard} from "../../components/book-card/book-card";
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookService} from '../../../../services/services/book.service';
import {Router, RouterLink} from '@angular/router';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-my-books',
  imports: [
    BookCard,
    RouterLink
  ],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss'
})
export class MyBooks implements OnInit {

  books = signal<PageResponseBookResponse>({});
  page = 0;
  size = 4;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooksByOwner({ page: this.page, size: this.size })
      .then(res => this.books.set(res ?? []));
  }

  protected gotToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  protected gotToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  protected gotToPage(index: number) {
    this.page = index;
    this.findAllBooks();
  }

  protected gotToNextPage() {
    this.page++;
    this.findAllBooks();
  }

  protected gotToLastPage() {
    this.page = this.books().totalPages as number - 1;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.books().totalPages as number - 1;
  }

  protected archiveBook(book: BookResponse) {
    this.bookService.updateArchivedStatus({
      'book-id': book.id as number
    }).then(() => {
      book.archived = !book.archived
      this.books.update(current => ({
        ...current,
        content: (current.content ?? []).map(b =>
          b.id === book.id
            ? { ...b, archived: book.archived }
            : b
        )
      }));

    })
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id]);
  }

  shareBook(book: BookResponse) {
    this.bookService.updateShareableStatus({
      'book-id': book.id as number
    }).then(() => {
      book.shareable = !book.shareable
      this.books.update(current => ({
        ...current,
        content: (current.content ?? []).map(b =>
          b.id === book.id
            ? { ...b, shareable: book.shareable }
            : b
        )
      }));

    })
  }
}
