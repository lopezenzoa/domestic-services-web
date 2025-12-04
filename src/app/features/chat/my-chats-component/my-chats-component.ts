import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CallService } from '../../providers/services/call-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../services/websocket-service';
import { effect } from '@angular/core';


export interface ChatListDTO {
  id: number;
  otherUserId: number;
  otherUserName: string;
  state: string;
  date: string;
  unreadCount: number;
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
  noChats: boolean = false;
  private ws = inject(WebSocketService);

  private refreshInterval: any;

  private router = inject(Router);
  private callService = inject(CallService);
  private cd = inject(ChangeDetectorRef);


listenWsEffect = effect(() => {
  const noti = this.ws.newMessage();

  if (noti) {
    
    const callId = noti.call?.id || noti.callId; 
    
    console.log(" WS: Mensaje recibido para Call ID:", callId);
    console.log(" Contenido del mensaje:", noti);

    if (callId) {
      
      const chatIndex = this.chats.findIndex(c => c.id === callId);
      
      if (chatIndex !== -1) {
        // Sumamos 1 al contador existente
        this.chats[chatIndex].unreadCount = (this.chats[chatIndex].unreadCount || 0) + 1;
        // Actualizamos fecha para que suba
        this.chats[chatIndex].date = new Date().toISOString();
        
        // Forzamos a Angular a detectar el cambio visual
        this.cd.detectChanges();
      } else {
        // Si no lo encuentra (chat nuevo), recargamos la lista
        this.loadChats();
      }
    }
  }
});
 ngOnInit() {
  // 1. Obtener mi usuario para saber mi ID
  const userJson = localStorage.getItem('user');
  
  if (userJson) {
    const user = JSON.parse(userJson);
    
    // 2. Conectarse al canal de notificaciones
    this.ws.connectToGlobalNotifications(user.id);
  } else {
    this.noChats = true;
    return; // Si no hay usuario, no cargamos nada
  }

  // 3. Cargar la lista de chats inicial (REST)
  this.loadChats();

  // El resto de tu código...
  this.callService.getMyChats().subscribe({
     // ...
  });
}


  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

loadChats() {
  const userJson = localStorage.getItem('user');

  if (!userJson) {
    this.noChats = true;
    return;
  }

  this.callService.getMyChats().subscribe({
    next: (chats) => {
      console.log("CHATS RECIBIDOS:", chats);

      const grouped = this.groupChats(chats);
      console.log("CHATS AGRUPADOS:", grouped);

      this.chats = grouped;
    },
    error: (err) => {
      console.error(" Error cargando chats:", err);
    }
  });
}

private groupChats(chats: any[]) {
  const map = new Map();

  chats.forEach(chat => {
    const key = chat.otherUserName;

    // Si el chat ya existe, elegimos el más reciente
    if (map.has(key)) {
      const existing = map.get(key);
      if (new Date(chat.date) > new Date(existing.date)) {
        map.set(key, chat);
      }
    } else {
      map.set(key, chat);
    }
  });

  return Array.from(map.values());
}


  removeDuplicates(list: ChatListDTO[]): ChatListDTO[] {
    const map = new Map<number, ChatListDTO>();

    list.forEach(item => {
      const existing = map.get(item.otherUserId);

      // Aseguramos que unreadCount sea un número válido
      const currentUnread = Number(item.unreadCount) || 0;

      if (!existing) {
        // Clonamos y aseguramos el número
        map.set(item.otherUserId, { ...item, unreadCount: currentUnread });
      } else {
        // FUSIÓN:
        const existingUnread = Number(existing.unreadCount) || 0;
        const totalUnread = existingUnread + currentUnread;

        const itemDate = new Date(item.date).getTime();
        const existingDate = new Date(existing.date).getTime();

        let winner: ChatListDTO;

        // Gana el más reciente
        if (itemDate > existingDate) {
          winner = { ...item }; 
        } else {
          winner = existing; 
        }

        // Le asignamos la SUMA TOTAL
        winner.unreadCount = totalUnread;

        map.set(item.otherUserId, winner);
      }
    });

    return Array.from(map.values());
  }

  openChat(callId: number) {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    
    const user = JSON.parse(raw);

    if (user.role === 'CLIENT') {
      this.router.navigate([`/client/chat/${callId}`]);
    } else {
      this.router.navigate([`/providers/chat/${callId}`]);
    }
  }
   
}