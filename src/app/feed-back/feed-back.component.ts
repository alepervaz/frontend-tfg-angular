import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RestService } from '../services/restService';
import { User } from '../models/user';
import { FeedBack } from '../models/FeedBack/FeedBack';
import { FeedBackRequest } from '../models/FeedBack/FeedBackRequest';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss'],
})
export class FeedBackComponent  implements OnInit {
  userAuth: User| undefined;
  feedbacks:FeedBack[]=[];
  userId:Number|undefined;
  isNewFeedbackModalOpen = false;
  newFeedback :FeedBackRequest=new FeedBackRequest();
  // feedbacks = [
  //   {
  //     comentario: '¡Gran aplicación! Me encanta la interfaz.',
  //     fecha: new Date('2025-02-10'),
  //     valoracion: 5
  //   },
  //   {
  //     comentario: 'La funcionalidad es buena, pero podría mejorar el rendimiento.',
  //     fecha: new Date('2025-02-08'),
  //     valoracion: 4
  //   },
  //   {
  //     comentario: 'No me ha convencido mucho. Hay fallos en la navegación.',
  //     fecha: new Date('2025-02-06'),
  //     valoracion: 2
  //   }
  // ];
  
  
  constructor(private authService:AuthService,private restService:RestService) { }

  async ngOnInit() {
    const navigation = window.history.state;
    if (navigation && navigation.userId) {
      this.userId=navigation.userId;
    }
    await this.getUser();
    await this.loadFeedback();
  }


  async getUser(): Promise<User|undefined>{
      return await this.authService.getUser().then(data=>
        this.userAuth=data
      )
    }

    async loadFeedback(){
      if(this.userId!=null)
      await this.restService.loadFeedBackUser(this.userId).then((response)=>{
        this.feedbacks=response.data;
    })
    }


    openNewFeedbackModal() {
      this.isNewFeedbackModalOpen = true;
    }
    
    setOpen(isOpen: boolean) {
      this.isNewFeedbackModalOpen = isOpen;
    }
    
    async submitNewFeedback() {
      // Lógica para guardar el nuevo feedback
      // Por ejemplo, hacer un push al array feedbacks o llamar a un servicio
      // ...
      // Al terminar, cierra el modal:
      if(this.userId!=null)this.newFeedback.clientId=this.userId;
      await this.restService.saveFeedBack(this.newFeedback).then((response)=>{
        this.ngOnInit();
      })
      this.isNewFeedbackModalOpen=false;
    }
}
