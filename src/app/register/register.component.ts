import { Component } from '@angular/core';
import { Gender, RegisterUser, User,obtenerValoresEnum  } from '../models/user';
import { DataManagementService } from '../services/data-management.service.service';
import { NavController } from '@ionic/angular';


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

  constructor(private userService: DataManagementService, private navCtrl: NavController) { }

  async onSubmit() {
    console.log(this.user);
    this.userService.register(this.user).then(
      data => {
        console.log('User registered successfully!', data);
        this.navCtrl.navigateRoot('');
      },
      error => {
        console.error('Error registering user!', error);
      }
    );
  }

  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;
  }

  getAvatarName(avatar: string): string {
    return avatar.split('.')[0];
  }
  
}
