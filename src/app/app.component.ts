import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from './services/auth.service';
import { NavController,MenuController } from '@ionic/angular';
import { FriendUserComponent } from './user/friend-user/friend-user.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private platform: Platform,  private authService: AuthService, private navCtrl: NavController,private menuCtrl: MenuController) {
    this.platform.ready().then((_) => this.closeSplash());
  }

  private async closeSplash() {
    await SplashScreen.hide();
  }

  logout():void{
    if(localStorage.key(1)=== null){
      this.authService.logout();
    }
  }

  async goToEdit() {
    this.navCtrl.navigateRoot('edit');
    this.menuCtrl.close();
  }

  async goToGroup() {
    this.navCtrl.navigateRoot('group');
    this.menuCtrl.close();
  }

  async goToFriend() {
    this.navCtrl.navigateRoot('user/friends');
    this.menuCtrl.close();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
