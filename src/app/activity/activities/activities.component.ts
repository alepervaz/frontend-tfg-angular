import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent  implements OnInit {
  group:Group=new Group();

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {
    const navigation = window.history.state;
    this.group=navigation.group
  }


  goToCreateActivity(group:Group){
    console.log(group)
    this.navCtrl.navigateRoot('create-activity', {
      state: { group }
    });
  }
}
