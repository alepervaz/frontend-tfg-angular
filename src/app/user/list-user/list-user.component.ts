import { Component, OnInit } from '@angular/core';

import { ActionSheetController, InfiniteScrollCustomEvent  } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pin, share, trash } from 'ionicons/icons';
import { NavController,MenuController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent  implements OnInit {
  listUser: User[] | undefined= [];
  filterListUser: User[] | undefined= [];
  constructor(private authService: AuthService, private navCtrl: NavController,private menuCtrl: MenuController, private dataManagementService: DataManagementService) {
  }

 ngOnInit() {
  this.listAllUser().then(() => {
    this.handleInput({ target: { value: '' } });
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
 
  
}
