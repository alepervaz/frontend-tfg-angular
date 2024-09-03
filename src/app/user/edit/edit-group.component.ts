import { Component, OnInit } from '@angular/core';
import { Gender, obtenerValoresEnum, User } from 'src/app/models/user';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { NavController } from '@ionic/angular';
import {jwtDecode} from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss'],
})
export class EditUserComponent  implements OnInit {

  genders: String[]= obtenerValoresEnum(Gender); 

  gender: Gender= Gender.FEMENINO;

  avatares = [
    'avatar1.png',
    'avatar2.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png',
    'avatar7.png',
  ];
  avatarSeleccionado: string = this.avatares[0];
  
  ngOnInit() {
    this.getUser();
  }

  user: User = new User();

  
  constructor(private userService: DataManagementService, private navCtrl: NavController, private auth: AuthService) { }

  async onSubmit() {
    this.userService.editUser(this.user).then(
      data => {
        console.log('User edited successfully!', data);
        //this.navCtrl.navigateRoot('');
      },
      error => {
        console.error('Error editing user!', error);
      }
    );
  }

  async getUser(){
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const username = decodedToken.sub;  // Aquí `sub` corresponde al subject, que es el username.
      this.user= await this.userService.getUser(username);
      this.getGender(this.user);
    }
    console.log(this.user);
  }

  async deleteUser(){
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const username = decodedToken.sub;  // Aquí `sub` corresponde al subject, que es el username.
      this.user= await this.userService.deleteUser(username);
      this.auth.logout()
    }
    console.log(this.user);
  }

  getGender(user:User){
    if(user.gender == Gender.FEMENINO){
      this.user.gender=Gender.FEMENINO;
    }else if(user.gender == Gender.MASCULINO){
      this.user.gender=Gender.MASCULINO;
    }else{
      this.user.gender=Gender.OTRO;
    }
  }

  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;
  }

  getAvatarName(avatar: string): string {
    return avatar.split('.')[0];
  }
}
