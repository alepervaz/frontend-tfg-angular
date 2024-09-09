import { Component, OnInit } from '@angular/core';
import { ListUserComponent } from '../list-user/list-user.component';
import { AuthService } from 'src/app/services/auth.service';
import { NavController,MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pin, share, trash } from 'ionicons/icons';
import { Friend, User } from 'src/app/models/user';
import { ActionSheetController, InfiniteScrollCustomEvent, IonModal   } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-friend-user',
  templateUrl: './friend-user.component.html',
  styleUrls: ['./friend-user.component.scss'],
})
export class FriendUserComponent  implements OnInit {
  listUser: User[] | undefined= [];
  filterListUser: User[] | undefined= [];
  userAuth: User| undefined;
  isModalOpen = false;
  selectedUser: any = null; 
  
  constructor(private actionSheetCtrl: ActionSheetController,  private navCtrl: NavController,private menuCtrl: MenuController, private dataManagementService: DataManagementService,
    private authService: AuthService
  ) {
    addIcons({ pin, share, trash });
   }

  async ngOnInit() {
    await this.getUser()
    await this.listAllUser().then(() => {
      this.handleInput({ target: { value: '' } });
    });
    console.log(this.listAllUser.length)
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


  openUserModal(user: User) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
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

  async getUser(): Promise<User|undefined>{
    return await this.authService.getUser().then(data=>
      this.userAuth=data
    )
  }

  async listAllUser(){
      this.listUser =await this.dataManagementService.listFriendUser(this.userAuth?.username)
    
     
  }

  onIonInfinite(ev:any) {
    this.listUser;
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
  

async goToList() {
  this.navCtrl.navigateRoot('user/list');
  this.menuCtrl.close();
}


}
