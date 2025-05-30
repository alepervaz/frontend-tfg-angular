import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController,MenuController,InfiniteScrollCustomEvent,PopoverController } from '@ionic/angular';
import { User } from '../models/user';
import { Group } from '../models/group';
import { getMyGroups } from '../models/getMyGroups';
import { RestService } from '../services/restService';
import { DeleteMemberGroup } from '../models/DeleteMemberGroup';
import { CreateGroupComponent } from './create-group/create-group.component';
import { LeaveGroup } from '../models/LeaveGroup';
import { ToastHelperService } from '../helpers/AlertHelper';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent  implements OnInit {
  userAuth: User| undefined;
  listMyGroups: Group[]|undefined=[];
  filterListGroup: Group[] = [];
  isModalOpen=false;
  groupListParams: getMyGroups={userId:undefined};
  selectedGroup: Group|undefined;
  deleteMemberParam:DeleteMemberGroup={userId:undefined,groupId:undefined};
  editGroupComponent=CreateGroupComponent;
  leaveGroupParam:LeaveGroup={userId:undefined,groupId:undefined};
  searchQuery: string = '';
  messageList:any[]=[];

  constructor( private authService: AuthService, private navCtrl: NavController,
    private menuCtrl: MenuController,
  private restService:RestService,private popoverController: PopoverController,private toastService: ToastHelperService) { }

  async ngOnInit() {
    await this.getUser()
    await this.listAllMyGroups().then(() => {
      this.applyFilters();
    });
  }


  async getUser(): Promise<User|undefined>{
    return await this.authService.getUser().then(data=>
      this.userAuth=data
    )
  }



  async goToCreateGroup() {
    this.navCtrl.navigateRoot('group/form');
    this.menuCtrl.close();
  }

  async goToListGroup() {
    this.navCtrl.navigateRoot('group/list');
    this.menuCtrl.close();
  }

  actionSheetButtons(group:Group) {
    return [{
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.deleteAction(group);
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
  async deleteAction(group:Group) {
    await this.leaveGroup(group);
  }

  shareAction() {
    console.log('Share action triggered');
    // Lógica para compartir algo
  }

  cancelAction() {
    console.log('Cancel action triggered');
    this.menuCtrl.close();
    // Lógica para cancelar la acción
  }

  onIonInfinite(ev:any) {
    this.listMyGroups;
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  

  async listAllMyGroups(){
    this.groupListParams.userId=this.userAuth?.id;
    await this.restService.listAllMyGroups(this.groupListParams).then((response)=>{
      this.listMyGroups=response.body.data
    })  
  }

  isAdministrator(group:Group){
    if(group.admin?.id==this.userAuth?.id)return true;
    return false
   
  }

  openUserModal(group: Group) {
    this.selectedGroup = group;
    this.isModalOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async deleteMember(member:User,group: Group){
    this.deleteMemberParam.userId=member.id;
    this.deleteMemberParam.groupId=group.id;
    await this.restService.deleteMemberGroups(this.deleteMemberParam).then((response)=>{
      this.setOpen(false);
      this.ngOnInit();
    })
  }

  async goToEditGroup(group:Group){
    await this.popoverController.dismiss();
    this.navCtrl.navigateRoot('group/form', {
      state: { group }
    });
  }

  async leaveGroup(group: Group){
    this.leaveGroupParam.userId=this.userAuth?.id;
    this.leaveGroupParam.groupId=group.id;
    await this.restService.leaveGroup(this.leaveGroupParam).then((response)=>{
      this.toastService.presentToast(response.body.message,undefined,'bottom','success')
      this.ngOnInit();
    })
    
  }

  async goToActivity(group:Group){
    this.navCtrl.navigateRoot('activities', {
      state: { group }
    });
  }

  async goToBalance(group:Group){
    const groupId=group.id
    this.navCtrl.navigateRoot('balance', {
      state: { groupId }
    });
  }

  async goToChat(group: Group) {
    if(group.id)await this.restService.getChatsGroups(group.id.toString() ?? '').then((response)=>{
    const messages = response.data;
    this.messageList = messages.map((item: any) => ({
  ...item,
  message_side: item.user === (this.userAuth?.id ? this.userAuth.id.toString() : '') ? 'sender' : 'receiver'
}));

this.navCtrl.navigateRoot(`chat/${this.userAuth?.id}`, {
  state: { group,messageList: this.messageList, miembros:group.miembros },
});
  });
  }


  handleInput(event: any) {
    this.searchQuery = event.target.value?.toLowerCase() || '';
    this.applyFilters();
  }


  applyFilters() {
  
    this.filterListGroup = (this.listMyGroups ?? []).filter(group => {
      const username = group.title?.toLowerCase() || '';
  
      return (
        username.includes(this.searchQuery)
      );
    });
  }
}
