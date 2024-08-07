import { Component } from '@angular/core';
import { User } from '../models/user';
import { DataManagementService } from '../services/data-management.service.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = new User();
  
  constructor(private userService: DataManagementService, private navCtrl: NavController) { }

  async onSubmit() {
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
}
