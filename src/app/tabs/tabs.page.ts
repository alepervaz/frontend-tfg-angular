import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { IonicModule,  } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor( private authService: AuthService, private navCtrl: NavController) {
    addIcons({ triangle, ellipse, square });
  }


  logout():void{
    if(localStorage.key(1)=== null){
      this.authService.logout();
    }
  }

  async goToEdit() {
    this.navCtrl.navigateRoot('edit');
  }
}
