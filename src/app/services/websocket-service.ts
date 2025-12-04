import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs'; // Importamos Subject para manejar eventos

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private client!: Client;
  
  // Tu Signal original (la dejamos por si la usas en otro lado)
  newMessage = signal<any | null>(null);
  
  // 2. Creamos un Subject privado para manejar el flujo de mensajes
  private messageSubject = new Subject<any>();
  
  private connected = false;

  connect(callId: number) {
    this.client = new Client({
      // Configuración correcta para SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.connected = true;
      console.log(" STOMP CONNECTED");

      // Suscripción al canal específico del chat
      this.client.subscribe(`/topic/chat/${callId}`, (msg: IMessage) => {
        if (msg.body) {
          const body = JSON.parse(msg.body);
          console.log("MENSAJE WS RECIBIDO:", body);

          // Actualizamos la señal (tu código original)
          this.newMessage.set(body);
          
          //Emitimos el mensaje también por el Subject
          // Esto es lo que escuchará tu componente chat-room
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

  // Al agregar esto, el error rojo en chat-room.ts desaparecerá.
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

      // Suscribirse al canal personal del usuario
    
      this.client.subscribe(`/topic/notifications/${userId}`, (msg: IMessage) => {
        if (msg.body) {
          const body = JSON.parse(msg.body);
          console.log(" NOTIFICACIÓN RECIBIDA:", body);
          
          // Usamos la misma señal o una nueva
          this.newMessage.set(body);
          this.messageSubject.next(body);
        }
      });
    };

    this.client.activate();
  }

}