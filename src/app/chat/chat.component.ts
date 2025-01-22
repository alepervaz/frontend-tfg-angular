import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/Chat/ChatMessage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  messageInput:string='';
  userId:string="";
  messageList:any[]=[];
  constructor(private chatService:ChatService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.userId=this.route.snapshot.params["userId"]
    this.chatService.joinRoom("ABC");
    this.lisenerMessage();
  }

  sendMessage(){
    const chatMessage={
      message:this.messageInput,
      user:this.userId
    }as ChatMessage
    console.log(chatMessage);
    this.chatService.sendMessage("ABC",chatMessage);
    this.messageInput='';
  }

  lisenerMessage(){
    this.chatService.getMessageSubject().subscribe((message:any)=>{
      this.messageList=message.map((item:any)=>({
        ...item,
        message_side:item.user===this.userId ? 'sender': 'receiver'
      }))
    });
  }

}
