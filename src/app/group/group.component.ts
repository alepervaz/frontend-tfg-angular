import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController,MenuController } from '@ionic/angular';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent  implements OnInit {


  constructor( private authService: AuthService, private navCtrl: NavController,
    private menuCtrl: MenuController) { }

  ngOnInit() {}


  async goToCreateGroup() {
    this.navCtrl.navigateRoot('group/create');
    this.menuCtrl.close();
  }

  async goToListGroup() {
    this.navCtrl.navigateRoot('group/list');
    this.menuCtrl.close();
  }

}
