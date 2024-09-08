import { Component, OnInit } from '@angular/core';

import { ActionSheetController, InfiniteScrollCustomEvent, ToastController   } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pin, share, trash } from 'ionicons/icons';
import { NavController,MenuController } from '@ionic/angular';
import { Friend, User } from 'src/app/models/user';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent  implements OnInit {
  listUser: User[] | undefined= [];
  filterListUser: User[] | undefined= [];
  userAuth: User| undefined;

  constructor(private authService: AuthService, private navCtrl: NavController,private menuCtrl: MenuController, private dataManagementService: DataManagementService, private toastController: ToastController,
    private router: Router
  ) {
  }

 ngOnInit() {
  this.listAllUser().then(() => {
    this.handleInput({ target: { value: '' } });
  });

  this.authService.getUser().then(user => {
    this.userAuth = user;
    console.log(this.userAuth)
  });
  
 }


 async listAllUser():Promise<void>{
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken: any = jwtDecode(token);
    const username = decodedToken.sub;  // Aquí `sub` corresponde al subject, que es el username.
    const users: User[]| undefined= await this.dataManagementService.listAllUser(username);
    console.log(users?.length);
    this.listUser=users;  
  }
}

onIonInfinite(ev:any) {
  this.listAllUser();
  setTimeout(() => {
    (ev as InfiniteScrollCustomEvent).target.complete();
  }, 500);
}

handleInput(event:any) {
  const query = event.target.value?.toLowerCase() || '';
  if (query.trim() === '') {
    this.filterListUser = this.listUser ?? [];
  } else {
      this.filterListUser = this.listUser?.filter((d) => d.username?.toLowerCase().includes(query));
    }
}

async sendRequestFriend(userReceived: string | undefined):Promise<void>{
  const userSend= await this.authService.getUser();
  console.log(userReceived);
  if(userReceived){
    this.dataManagementService.sendRequestFriend(userSend?.username,userReceived)
    window.location.reload();
  }else{
    this.showErrorToast();
  }  

}


async showErrorToast() {
  const toast = await this.toastController.create({
    message: 'Error: Usuario no válido o indefinido.',
    duration: 2000,   // Duración en milisegundos
    color: 'danger',  // Color del toast (opcional)
    position: 'bottom'  // Posición: 'top', 'middle' o 'bottom'
  });
  await toast.present();
}


 isFriend(user: Friend[]| undefined): boolean | undefined{
  return this.userAuth?.friends?.some(friend=> user?.find(friends=> friends.id === friend.id));
 }
  
}
