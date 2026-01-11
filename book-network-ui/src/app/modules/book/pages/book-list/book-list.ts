import {Component, OnInit, signal} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {Router} from '@angular/router';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookCard} from '../../components/book-card/book-card';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-book-list',
  imports: [
    BookCard
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookList implements OnInit {
  books = signal<PageResponseBookResponse>({});
  page = 0;
  size = 1;
  message = signal('');
  level: string = 'success';

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
       this.findAllBooks();
    }

  private findAllBooks() {
    this.bookService.findAllBooks({ page: this.page, size: this.size })
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

  protected borrowBook(book: BookResponse) {
    this.message.set('');
    this.bookService.borrowBook({
      'book-id': book.id as number
    }).then(() => {
      this.level = 'success';
      this.message.set("Book Successfully added to your list");
    }).catch((err) => {
      this.level = 'error';
      this.message.set(err.error.error);
    });
  }
}
