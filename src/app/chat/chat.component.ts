import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/Chat/ChatMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  constructor(private chatService:ChatService) { }

  ngOnInit() {
    this.chatService.joinRoom("ABC")
  }

  sendMessage(){
    const chatMessage={
      message:'hola',
      user:'1'
    }as ChatMessage
    this.chatService.sendMessage("ABC",chatMessage);
  }

}
