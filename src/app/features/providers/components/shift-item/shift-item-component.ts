import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Shift } from '../../../../shared/models/Shift';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shift-item-component',
  imports: [DatePipe],
  templateUrl: './shift-item-component.html',
  styleUrl: './shift-item-component.css',
})
export class ShiftItemComponent {

  @Input() shift!: Shift;

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.shift.id);
  }

  onDelete() {
    this.delete.emit(this.shift.id);
  }
}
