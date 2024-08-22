import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
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
      console.log(username);
      this.user= await this.userService.getUser(username);
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

}
