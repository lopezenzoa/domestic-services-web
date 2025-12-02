import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../providers/services/message.service';
import { CallService } from '../../providers/services/call-service';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  imports: [DatePipe,FormsModule,CommonModule],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.css'
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  role = '';                  
  callId = 0;
  user: any;

  otherUserName = 'Cargando...';

  messages = signal<any[]>([]);
  newMessage = signal('');

  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private callService: CallService
  ) {}

  ngOnInit() {

    this.role = this.route.snapshot.data['role'];
    this.callId = Number(this.route.snapshot.paramMap.get('callId'));
    this.user = JSON.parse(localStorage.getItem('user')!);

    this.loadOtherUserName();
    this.loadMessages();
    this.intervalId = setInterval(() => this.loadMessages(), 2000);
  }
isMine(msg: any) {
  return msg.authorRole === this.role;
}




  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadOtherUserName() {
    if (this.role === 'CLIENT') {
      this.callService.getCallDetailForClient(this.callId).subscribe(call => {
        this.otherUserName = `${call.provider.firstName} ${call.provider.lastName}`;
      });

    } else {
      // PROVIDER
      this.callService.getProviderCallDetail(this.user.id, this.callId).subscribe(call => {
        this.otherUserName = `${call.client.firstName} ${call.client.lastName}`;
      });
    }
  }

 loadMessages() {
  this.messageService.getMessages(this.callId).subscribe(res => {
    console.log("MENSAJES DEL BACKEND ===>", res);
    this.messages.set(res);
    this.scrollToBottom();
  });
}


  send() {
    const content = this.newMessage().trim();
    if (!content) return;

    this.messageService.sendMessage({
      callId: this.callId,
      authorId: this.user.id,
      authorRole: this.role,      // ACÁ SE DEFINE CLIENT O PROVIDER
      content
    }).subscribe(newMsg => {
      this.messages.update(old => [...old, newMsg]);
      this.newMessage.set('');
      this.scrollToBottom();
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
}