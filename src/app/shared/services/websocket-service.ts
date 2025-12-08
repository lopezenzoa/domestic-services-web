import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private client!: Client;
  private connected = false;

  newMessage = signal<any | null>(null);
  private messageSubject = new Subject<any>();

  constructor() {}

 
  connect(callId: number) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.connected = true;
     

      this.client.subscribe(`/topic/chat/${callId}`, (msg: IMessage) => {
        if (!msg.body) return;
        const body = JSON.parse(msg.body);

        this.newMessage.set(body);
        this.messageSubject.next(body);
      });
    };

    this.client.activate();
  }


  connectToGlobalNotifications(userId: number) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.connected = true;
    
      this.client.subscribe(`/topic/notifications/${userId}`, (msg: IMessage) => {
        if (!msg.body) return;
        const body = JSON.parse(msg.body);

        this.newMessage.set(body);
        this.messageSubject.next(body);
      });
    };

    this.client.activate();
  }

  
  send(callId: number, msg: any) {
    if (!this.client || !this.client.connected) {
     
      return;
    }

    this.client.publish({
      destination: `/app/chat/${callId}`,
      body: JSON.stringify(msg)
    });
  }

 
  subscribeToChat(callback: (msg: any) => void) {
    return this.messageSubject.subscribe(callback);
  }

}
