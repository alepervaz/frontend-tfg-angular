import { Component, OnInit } from '@angular/core';

import { ActionSheetController, InfiniteScrollCustomEvent  } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pin, share, trash } from 'ionicons/icons';
import { NavController,MenuController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent  implements OnInit {
  listUser: User[] | undefined= [];
  filterListUser: User[] | undefined= [];
  constructor(private actionSheetCtrl: ActionSheetController,  private navCtrl: NavController,private menuCtrl: MenuController, private dataManagementService: DataManagementService) {
    addIcons({ pin, share, trash });
   }

  ngOnInit() {
    this.listAllUser().then(() => {
      this.handleInput({ target: { value: '' } });
    });
  }

  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.deleteAction();
      }
    },
    {
      text: 'Share',
      data: {
        action: 'share',
      },
      handler: () => {
        this.shareAction();
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.cancelAction();
      }
    },
  ];


  async goToEdit() {
    this.navCtrl.navigateRoot('edit');
    this.menuCtrl.close();
  }
  deleteAction() {
    console.log('Delete action triggered');
    this.navCtrl.navigateRoot('edit');
    this.menuCtrl.close();
    // Lógica para eliminar algo
  }

  shareAction() {
    console.log('Share action triggered');
    // Lógica para compartir algo
  }

  cancelAction() {
    console.log('Cancel action triggered');
    this.navCtrl.navigateRoot('user/list');
    this.menuCtrl.close();
    // Lógica para cancelar la acción
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
