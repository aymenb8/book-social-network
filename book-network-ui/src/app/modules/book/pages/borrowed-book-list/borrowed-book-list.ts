import {Component, OnInit, signal} from '@angular/core';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {BookService} from '../../../../services/services/book.service';
import {FeedbackRequest} from '../../../../services/models/feedback-request';
import {FormsModule} from '@angular/forms';
import {Rating} from '../../components/rating/rating';
import {RouterLink} from '@angular/router';
import {FeedbackService} from '../../../../services/services/feedback.service';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [
    FormsModule,
    Rating,
    RouterLink
  ],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss'
})
export class BorrowedBookList implements OnInit{
  page: number = 0;
  size: number = 5;
  selectedBook: BorrowedBookResponse | undefined = undefined;
  feedbackRequest: FeedbackRequest = {bookId: 0, comment: "", note: 0};

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService
  ){
  }

  ngOnInit(): void {
      this.findAllBorrowedBooks();
  }

  borrowedBooks = signal<PageResponseBorrowedBookResponse>({});

  protected returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = book.id as number;
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).then((resp) => {
      this.borrowedBooks.set(resp);
    })
  }


  protected gotToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  protected gotToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  protected gotToPage(index: number) {
    this.page = index;
    this.findAllBorrowedBooks();
  }

  protected gotToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }

  protected gotToLastPage() {
    this.page = this.borrowedBooks().totalPages as number - 1;
    this.findAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.borrowedBooks().totalPages as number - 1;
  }

  protected returnBook(withFeedback: boolean) {
    console.log(this.selectedBook, this.feedbackRequest)
      this.bookService.returnBorrowedBook({
        'book-id': this.selectedBook?.id as number
      }).then(() => {
        if(withFeedback){
          this.giveFeedback();
        }
        this.selectedBook = undefined;
        this.findAllBorrowedBooks();
      })
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest
    }).then(() => {})
  }
}
