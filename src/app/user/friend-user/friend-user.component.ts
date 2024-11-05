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
import { deleteFriend } from 'src/app/models/deleteFriend';

@Component({
  selector: 'app-friend-user',
  templateUrl: './friend-user.component.html',
  styleUrls: ['./friend-user.component.scss'],
})
export class FriendUserComponent  implements OnInit {
  listMyFriendsUser: User[] | undefined= [];
  filterListMyFriendsUser: User[] | undefined= [];
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
  


  actionSheetButtons(user: User) {
    return [{
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.deleteAction(user);
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
  ]
  }


  openUserModal(user: User) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  deleteAction(friend: User) {
    console.log('Delete action triggered');
    console.log(friend)
    const deleteFriendObject: deleteFriend={
      userId:this.userAuth?.id,
      friendId:friend.id
    };
    this.dataManagementService.deleteFriend(deleteFriendObject)
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
      this.listMyFriendsUser =await this.dataManagementService.listFriendUser(this.userAuth?.username)
    
     
  }

  onIonInfinite(ev:any) {
    this.listMyFriendsUser;
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  handleInput(event:any) {
    const query = event.target.value?.toLowerCase() || '';
    if (query.trim() === '') {
      this.filterListMyFriendsUser = this.listMyFriendsUser ?? [];
    } else {
        this.filterListMyFriendsUser = this.listMyFriendsUser?.filter((d) => d.username?.toLowerCase().includes(query));
      }
}
  

async goToList() {
  this.navCtrl.navigateRoot('user/list');
  this.menuCtrl.close();
}


}
