import { Component, OnDestroy, OnInit, signal, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../providers/services/message.service';
import { CallService } from '../../providers/services/call-service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../services/websocket-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  imports: [DatePipe, FormsModule, CommonModule],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.css',
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  role = '';
  callId = 0;
  user: any;

  otherUserName = 'Cargando...';

  messages = signal<any[]>([]);
  newMessage = signal('');

  private intervalId: any;
  private wsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private callService: CallService,
    private ws: WebSocketService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.role = this.route.snapshot.data['role'];
    this.callId = Number(this.route.snapshot.paramMap.get('callId'));
    this.user = JSON.parse(localStorage.getItem('user')!);

    this.loadOtherUserName();
    this.loadMessages();

    
    this.ws.connect(this.callId);

    this.wsSubscription = this.ws.subscribeToChat((msg: any) => {
     

      if (!msg) return;

      this.ngZone.run(() => {

       
        if (msg.type === 'MESSAGES_SEEN' || msg.action === 'READ' || msg.leido === true) {
  
           
           this.messages.update(prev => prev.map(m => {
            
              if (m.authorId === this.user.id) {
                 return { ...m, seen: true, visto: true }; 
              }
              return m;
           }));
           
           this.cdr.detectChanges();
           return;
        }

        if (!msg.content && msg.texto) msg.content = msg.texto;
        if (!msg.texto && msg.content) msg.texto = msg.content; 
        if (!msg.fechaEnvio && msg.timestamp) msg.fechaEnvio = msg.timestamp;

        
        this.messages.update(prev => {
          const yaExiste = prev.some(m => String(m.id) === String(msg.id));
          
          if (yaExiste) {
            
             if (msg.seen || msg.visto) {
                return prev.map(m => String(m.id) === String(msg.id) ? { ...m, seen: true } : m);
             }
             return prev;
          }

          const nuevos = [...prev, msg];
          return nuevos;
        });

        this.cdr.detectChanges(); 
        setTimeout(() => this.scrollToBottom(), 100);
      });
    });
  }

  isMine(msg: any) {
    return msg.authorRole === this.role;
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.wsSubscription) this.wsSubscription.unsubscribe();
  }

  loadOtherUserName() {
    if (this.role === 'CLIENT') {
      this.callService.getCallDetailForClient(this.callId).subscribe((call) => {
          this.otherUserName = `${call.provider.firstName} ${call.provider.lastName}`;
      });
    } else {
      this.callService.getProviderCallDetail(this.user.id, this.callId).subscribe((call) => {
          this.otherUserName = `${call.client.firstName} ${call.client.lastName}`;
      });
    }
  }

  loadMessages() {
    this.messageService.getMessages(this.callId).subscribe(res => {
      this.messages.set(res);
      this.messageService.markAsSeen(this.callId, this.user.id).subscribe();
      this.scrollToBottom();
    });
  }

  send() {
    const content = this.newMessage().trim();
    if (!content) return;

    
    this.messageService.sendMessage({
      callId: this.callId,
      authorId: this.user.id,
      authorRole: this.role,
      content
    }).subscribe({
      next: () => {
        this.newMessage.set('');
        this.scrollToBottom();
      },
      error: err => console.error(err)
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }
  showDateSeparator(msg: any, index: number): boolean {
  if (index === 0) return true; 

  const prevMsg = this.messages()[index - 1];
  
  const current = new Date(msg.timestamp || msg.fechaEnvio);
  const prev = new Date(prevMsg.timestamp || prevMsg.fechaEnvio);

  return current.getDate() !== prev.getDate() ||
         current.getMonth() !== prev.getMonth() ||
         current.getFullYear() !== prev.getFullYear();
}
}