import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController,MenuController } from '@ionic/angular';
import { User } from '../models/user';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent  implements OnInit {
  userAuth: User| undefined;

  constructor( private authService: AuthService, private navCtrl: NavController,
    private menuCtrl: MenuController) { }

  async ngOnInit() {
    await this.getUser()
    console.log(this.userAuth)
  }


  async getUser(): Promise<User|undefined>{
    return await this.authService.getUser().then(data=>
      this.userAuth=data
    )
  }



  async goToCreateGroup() {
    this.navCtrl.navigateRoot('group/create');
    this.menuCtrl.close();
  }

  async goToListGroup() {
    this.navCtrl.navigateRoot('group/list');
    this.menuCtrl.close();
  }

}
