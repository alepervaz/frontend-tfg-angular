import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from '../models/Chat/ChatMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient:any
  constructor() {
    this.initConnectionSocket();
   }

   initConnectionSocket() {
    const url = '//localhost:8080/chat-socket';
    const socket = new SockJS(url);
  
    this.stompClient = Stomp.over(socket);
  
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí pasamos el token en las cabeceras
      this.stompClient.connect(
        { Authorization: `Bearer ${token}` }, // <--- Cabeceras personalizadas
        () => {
          console.log('Connected to WebSocket');
        },
        (error: any) => {
          console.error('Error connecting to WebSocket:', error);
        }
      );
    } else {
      console.warn('Token not found in localStorage. WebSocket connection might fail.');
    }
  }
  
  
  joinRoom(roomId: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(
        `/topic/${roomId}`,
        (message: any) => {
          const messageContent = JSON.parse(message.body);
          console.log(messageContent);
        },
        // Cabeceras personalizadas en la suscripción (opcional si tu servidor lo requiere)
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
      );
    } else {
      console.error('Stomp client is not connected');
    }
  }
  

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    const token = localStorage.getItem('token');
    this.stompClient.send(
      `/app/chat/${roomId}`,
      { Authorization: `Bearer ${token}` },  // <--- cabeceras
      JSON.stringify(chatMessage)
    );
  }
  
}
