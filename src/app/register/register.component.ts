import { Component } from '@angular/core';
import { Gender, RegisterUser, User,obtenerValoresEnum  } from '../models/user';
import { DataManagementService } from '../services/data-management.service.service';
import { NavController } from '@ionic/angular';
import { RestService } from '../services/restService';
import { ToastHelperService } from '../helpers/AlertHelper';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: RegisterUser = new RegisterUser();
  genders: String[]= obtenerValoresEnum(Gender); 
  avatares = [
    'avatar1.png',
    'avatar2.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png',
    'avatar7.png',
  ];
  avatarSeleccionado: string = this.avatares[0]; // Inicializa con el primer avatar

  constructor(private restService: RestService, private navCtrl: NavController,private toastService: ToastHelperService) { }

  async onSubmit() {
    try {
      await this.restService.register(this.user).then((response)=>{
      if(response.status==200){
        this.toastService.presentToast(response.body.message, undefined, 'bottom', 'success');
      }
      this.navCtrl.navigateRoot('');
      });
      
    } catch (response:any) {
      console.error('Error al registrar usuario:', response);
      this.toastService.presentToast(response.error.message, undefined, 'bottom', 'danger');
    }
  }
  

  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;
  }

  getAvatarName(avatar: string): string {
    return avatar.split('.')[0];
  }
  
}
