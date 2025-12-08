import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Call } from '../../../../shared/models/Call';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-call-card-component',
  imports: [CommonModule,NgIf],
  templateUrl: './call-card-component.html',
  styleUrl: './call-card-component.css',
})
export class CallCardComponent {

  @Input() call!: Call;

  @Output() accept = new EventEmitter<number>();
  @Output() deny = new EventEmitter<number>();
  @Output() finish = new EventEmitter<number>();
  @Output() chat = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();

  onAccept() { 
    this.accept.emit(this.call.id);
   }
  onDeny() { 
    this.deny.emit(this.call.id); 
  }
  onFinish() { 
    this.finish.emit(this.call.id); 
  }
  onChat() { 
    this.chat.emit(this.call.id); 
  }
  onEdit() { 
    this.edit.emit(this.call.id);
   }
  isPast(call: Call): boolean {
  return new Date(call.date) < new Date();
}
getStateLabel(state: string): string {
  switch (state) {
    case 'REQUESTING': return 'Solicitado';
    case 'PENDING': return 'Aceptado';
    case 'DECLINED': return 'Rechazado';
    case 'FINISHED': return 'Finalizado';
    default: return state;
  }
}

getStateClass(state: string) {
  return {
    'state-requesting': state === 'REQUESTING',
    'state-pending': state === 'PENDING',
    'state-declined': state === 'DECLINED',
    'state-finished': state === 'FINISHED',
  };
}
translateState(state: string): string {
  const map: any = {
    REQUESTING: 'Solicitado',
    PENDING: 'Aceptado',
    FINISHED: 'Finalizado',
    DECLINED: 'Rechazado'
  };

  return map[state] || state;
}


}
