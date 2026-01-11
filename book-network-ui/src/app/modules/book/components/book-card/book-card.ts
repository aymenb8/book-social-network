import {Component, EventEmitter, Input, output, Output, signal} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';
import {Rating} from '../rating/rating';

@Component({
  selector: 'app-book-card',
  imports: [
    Rating
  ],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss'
})
export class BookCard {

  private _book= signal<BookResponse>({})
  share = output<BookResponse>()
  archive = output<BookResponse>()
  addToWaitingList = output<BookResponse>()
  borrow = output<BookResponse>()
  edit = output<BookResponse>()
  details = output<BookResponse>()
  private _bookCover: string | undefined;
  private _manage: boolean = false;

  get book(): BookResponse {
    return this._book();
  }

  @Input()
  set book(value: BookResponse) {
    this._book.set(value);
  }

  get bookCover(): string | undefined {
    if(this._book().cover){
      return 'data:image/jpg;base64,' + this._book().cover;
    }
    return 'https://voir-plus.com/wp-content/uploads/2020/01/Inetrnet-00.jpg';
  }


  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }


  // @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  // @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  protected onShowDetails() {
    this.details.emit(this.book);
  }

  protected onBorrow() {
    this.borrow.emit(this.book);
  }

  protected onAddToWaitingList() {
    this.addToWaitingList.emit(this.book);
  }

  protected onEdit() {
    this.edit.emit(this.book);
  }

  protected onShare() {
    this.share.emit(this.book);
  }

  protected onArchive() {
    this.archive.emit(this.book);
  }
}
