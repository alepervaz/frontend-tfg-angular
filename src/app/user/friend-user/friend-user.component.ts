import { Component, OnInit } from '@angular/core';
import { ListUserComponent } from '../list-user/list-user.component';
import { AuthService } from 'src/app/services/auth.service';
import { NavController,MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pin, share, trash } from 'ionicons/icons';

@Component({
  selector: 'app-friend-user',
  templateUrl: './friend-user.component.html',
  styleUrls: ['./friend-user.component.scss'],
})
export class FriendUserComponent  implements OnInit {
  
  constructor(private authService: AuthService, private navCtrl: NavController,private menuCtrl: MenuController) {
   }

  ngOnInit() {}


  async goToListUser() {
    this.navCtrl.navigateRoot('user/list');
    this.menuCtrl.close();
  }
}
