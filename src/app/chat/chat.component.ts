import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/Chat/ChatMessage';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../services/restService';
import { GetGroupRequest } from '../models/Balance/GetGroupRequest';
import { Group } from '../models/group';
import { User } from '../models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  miembros:User[]=[];
  group:Group=new Group;
  messageInput:string='';
  userId:string="";
  messageList:any[]=[];
  constructor(private chatService:ChatService,private route:ActivatedRoute,private restService:RestService) { }

  async ngOnInit() {
    this.userId = this.route.snapshot.params["userId"];
    const navigation = window.history.state;
  
    // 1. Si vienen mensajes desde la navegación, los cargamos
    if (navigation && navigation.group) {
      // Primero, asignamos el group si es necesario
      this.group = navigation.group;
      this.miembros=navigation.miembros;
      // Si navigation.messageList es un array, la mapeamos para añadir message_side
      if (navigation.messageList && Array.isArray(navigation.messageList)) {
        this.messageList = navigation.messageList.map((item: any) => ({
          ...item,
          message_side: item.user === this.userId ? 'sender' : 'receiver',
          avatar:this.miembros.filter(miembro=>miembro.id?.toString()==item.user).map(miembro=>miembro.avatar),
          username:this.miembros.filter(miembro=>miembro.id?.toString()==item.user).map(miembro=>miembro.username)
        }));
      }
    }
  
    // 2. Nos unimos al room (asumiendo que this.group ya está cargado)
    this.chatService.joinRoom(this.group.id?.toString() ?? '');
  
    // 3. Registramos el listener para mensajes nuevos
    this.lisenerMessage();
  }
  

  sendMessage(){
    const chatMessage={
      message:this.messageInput,
      user:this.userId
    }as ChatMessage
    this.chatService.sendMessage(this.group.id?.toString()??'',chatMessage);
    this.messageInput='';
  }

  lisenerMessage() {
    // Suponiendo que getMessageSubject() emite un array de mensajes nuevos
    this.chatService.getMessageSubject().subscribe((newMessages: any[]) => {
        // 1. Si no hay mensajes nuevos, salimos de la función
        if (!newMessages || newMessages.length === 0) {
            return;
        }

        // 2. Obtenemos el último mensaje del array de nuevos mensajes
        const lastMessage = newMessages[newMessages.length - 1];

        // 3. Aplicamos el mapeo solo al último mensaje
        const mappedLastMessage = {
            ...lastMessage,
            message_side: lastMessage.user === this.userId ? 'sender' : 'receiver',
            avatar:this.miembros.filter(miembro=>miembro.id?.toString()==this.userId).map(miembro=>miembro.avatar),
            username:this.miembros.filter(miembro=>miembro.id?.toString()==this.userId).map(miembro=>miembro.username)
        };

        // 4. Combinamos los mensajes viejos con los nuevos, añadiendo solo el último mapeado
        this.messageList = [
            ...this.messageList,
            mappedLastMessage
        ];
    });
}

  
 // Método para manejar el error al cargar la imagen
 handleImageError(item: any) {
  // Si falla la carga de la imagen, ponemos al usuario como anónimo y sin avatar
  item.username = 'Anónimo';
  item.avatar = null;
}
  

}
