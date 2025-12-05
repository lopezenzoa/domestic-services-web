import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs'; 
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private client!: Client;
  

  newMessage = signal<any | null>(null);
  
 
  private messageSubject = new Subject<any>();
  
  private connected = false;

  connect(callId: number) {
    this.client = new Client({
      
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.connected = true;
      console.log(" STOMP CONNECTED");

      this.client.subscribe(`/topic/chat/${callId}`, (msg: IMessage) => {
        if (msg.body) {
          const body = JSON.parse(msg.body);
          console.log("MENSAJE WS RECIBIDO:", body);

          this.newMessage.set(body);
          
          this.messageSubject.next(body);
        }
      });
    };

    this.client.activate();
  }

  send(callId: number, msg: any) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/chat/${callId}`,
        body: JSON.stringify(msg)
      });
    } else {
      console.warn(' No se pudo enviar: WebSocket no conectado.');
    }
  }

subscribeToChat(callback: (msg: any) => void) {
  return this.messageSubject.subscribe(callback);
}



  connectToGlobalNotifications(userId: number) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      this.connected = true;
      console.log(` STOMP CONNECTED GLOBAL para Usuario ${userId}`);

      this.client.subscribe(`/topic/notifications/${userId}`, (msg: IMessage) => {
        if (msg.body) {
          const body = JSON.parse(msg.body);
          console.log(" NOTIFICACIÓN RECIBIDA:", body);
 
          this.newMessage.set(body);
          this.messageSubject.next(body);
        }
      });
    };

    this.client.activate();
  }

}