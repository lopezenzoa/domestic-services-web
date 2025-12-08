import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CallService } from '../../../shared/services/call-service';
import { WebSocketService } from '../../../shared/services/websocket-service';

export interface ChatListDTO {
  id: number;
  otherUserId: number;
  otherUserName: string;
  state: string;
  date: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

@Component({
  selector: 'app-my-chats-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-chats-component.html',
  styleUrls: ['./my-chats-component.css'],
})
export class MyChatsComponent implements OnInit, OnDestroy {

  chats: ChatListDTO[] = [];
  noChats = false;

  private ws = inject(WebSocketService);
  private router = inject(Router);
  private callService = inject(CallService);
  private cd = inject(ChangeDetectorRef);

  private refreshInterval: any;

  constructor() {
    
    effect(() => {
      const noti = this.ws.newMessage();

      if (!noti) return;

      const callId = noti.call?.id || noti.callId;
      if (!callId) return;

      const index = this.chats.findIndex(c => c.id === callId);

      if (index !== -1) {
        
        this.chats[index].unreadCount = (this.chats[index].unreadCount || 0) + 1;
        this.chats[index].lastMessageTime = new Date().toISOString();
        this.sortChats();
        this.cd.detectChanges();
      } else {
        
        this.loadChats();
      }
    });
  }

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    if (!raw) {
      this.noChats = true;
      return;
    }

    const user = JSON.parse(raw);

 
    this.ws.connectToGlobalNotifications(user.id);

    
    this.loadChats();
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

 
  loadChats() {
    this.callService.getMyChats().subscribe({
      next: (res) => {
        const grouped = this.groupChats(res);
        this.chats = grouped;
        this.sortChats();
        this.noChats = this.chats.length === 0;
      },
      error: (err) => console.error(err)
    });
  }
  private groupChats(chats: ChatListDTO[]): ChatListDTO[] {
    const map = new Map<number, ChatListDTO>();

    chats.forEach(chat => {
      const existing = map.get(chat.otherUserId);

      if (!existing) {
        map.set(chat.otherUserId, { ...chat });
        return;
      }

      const timeNew = new Date(chat.lastMessageTime || chat.date).getTime();
      const timeOld = new Date(existing.lastMessageTime || existing.date).getTime();

      const winner = timeNew > timeOld ? chat : existing;

      winner.unreadCount = (existing.unreadCount || 0) + (chat.unreadCount || 0);

      map.set(chat.otherUserId, winner);
    });

    return Array.from(map.values());
  }


  private sortChats() {
    this.chats.sort((a, b) => {
      const t1 = new Date(a.lastMessageTime || a.date).getTime();
      const t2 = new Date(b.lastMessageTime || b.date).getTime();
      return t2 - t1;
    });
  }

  
  openChat(callId: number) {
    const raw = localStorage.getItem('user');
    if (!raw) return;

    const user = JSON.parse(raw);

    const route =
      user.role === 'CLIENT'
        ? `/client/chat/${callId}`
        : `/providers/chat/${callId}`;

    this.router.navigate([route]);
  }
}
