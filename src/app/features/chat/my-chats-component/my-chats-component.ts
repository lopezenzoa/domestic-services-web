import { Component, inject, OnInit } from '@angular/core';
import { CallService } from '../../providers/services/call-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-my-chats-component',
  imports: [CommonModule],
  templateUrl: './my-chats-component.html',
  styleUrls: ['./my-chats-component.css'],
})
export class MyChatsComponent implements OnInit {
  chats: any[] = [];
  user: any;
  noChats: boolean = false;
  router = inject(Router);
  constructor(private callService: CallService) {}

  ngOnInit() {
    // 1. Obtener el usuario de forma segura
    const userJson = localStorage.getItem('user');
    
    // SI NO HAY USER, NO SIGAS
    if (!userJson) {
      console.error("No hay usuario logueado en localStorage");
      this.noChats = true;
      return;
    }

    const user = JSON.parse(userJson);

    // SI EL USER ESTA MAL FORMADO O SIN ID
    if (!user || !user.id) {
      console.error("El usuario no tiene ID válido:", user);
      this.noChats = true;
      return;
    }

    // 2. Llamada al servicio
   this.callService.getMyChats().subscribe({

      next: (chats: any) => {
       
          this.chats = this.removeDuplicatedChats(chats);
        
        // Verificamos si la lista viene vacía
        if (!chats || chats.length === 0) {
          this.noChats = true;
        } else {
          this.noChats = false;
        }
      },
      error: (error) => {
        console.error("Error cargando chats:", error);
        if (error.status === 403) {
           console.warn("Recuerda reiniciar el Backend si cambiaste SecurityConfig");
        }
      }
    });

  }
    removeDuplicatedChats(chats: any[]) {
    const unique = new Map();

    chats.forEach(c => {
      unique.set(c.otherUserName, c); // si viene repetido, lo reemplaza
    });

    return Array.from(unique.values());
  }
openChat(callId: number) {

  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return;

  if (user.role === 'CLIENT') {
    this.router.navigate([`/client/chat/${callId}`]);
  } else if (user.role === 'PROVIDER') {
    this.router.navigate([`/providers/chat/${callId}`]);
  }
}

}
