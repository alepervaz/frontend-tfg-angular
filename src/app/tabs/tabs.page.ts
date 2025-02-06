import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { IonicModule,  } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Notification } from '../models/Notification';
import { RestService } from '../services/restService';
import { User } from '../models/user';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  noti:Notification[]=[];
  userAuth: User| undefined;
  public environmentInjector = inject(EnvironmentInjector);

  constructor( private authService: AuthService, private navCtrl: NavController, private restService:RestService) {
    addIcons({ triangle, ellipse, square });
  }

  async ngOnInit() {
    await this.getUser()
    await this.loadNotification()
    console.log(this.userAuth)
  }

  async getUser(): Promise<User|undefined>{
    return await this.authService.getUser().then(data=>
      this.userAuth=data
    )
  }

  logout():void{
    if(localStorage.key(1)=== null){
      this.authService.logout();
    }
  }

  async goToEdit() {
    this.navCtrl.navigateRoot('edit');
  }

  async loadNotification(){
    if(this.userAuth?.id!=null)
    await this.restService.getNotifications(this.userAuth?.id).then((response)=>{
      console.log(response);
    })
  }
}
