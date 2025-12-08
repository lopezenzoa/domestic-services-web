import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  standalone: true,
  imports: [NgIf],
  templateUrl: './pagination-component.html',
  styleUrl: './pagination-component.css',
})
export class PaginationComponent {
@Input() currentPage = 0;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  prev() {
    if (this.currentPage > 0)
      this.pageChange.emit(this.currentPage - 1);
  }

  next() {
    if (this.currentPage + 1 < this.totalPages)
      this.pageChange.emit(this.currentPage + 1);
  }
}
