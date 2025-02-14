import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from '../models/Chat/ChatMessage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient:any
  private messageSubject:BehaviorSubject<ChatMessage[]>=new BehaviorSubject<ChatMessage[]>([]);


  constructor() {
    this.initConnectionSocket();
   }

   initConnectionSocket() {
    // Ajusta la ruta al WebSocket según tu configuración en el backend
    const url = '//localhost:8080/chat-socket';
    const socket = new SockJS(url);
    this.stompClient=Stomp.over(socket)
  }

  joinRoom(roomId: string) {
    console.log("holas4")
    console.log(roomId)
          
   this.stompClient.connect({},()=>{
    this.stompClient.subscribe(`/topic/${roomId}`,(messages:any)=>{
      const messageContent=JSON.parse(messages.body);
      console.log(messageContent)
      const currentMessage=this.messageSubject.getValue();
      currentMessage.push(messageContent);
      this.messageSubject.next(currentMessage);
    })
   })
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`,{},JSON.stringify(chatMessage));
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
  
}
