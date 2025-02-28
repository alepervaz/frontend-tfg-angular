import { Component, OnInit } from '@angular/core';
import { getGroupListParams } from 'src/app/models/getGroupListParams';
import { Group } from 'src/app/models/group';
import { JoinGroup } from 'src/app/models/joinGroup';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/restService';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss'],
})
export class ListGroupComponent  implements OnInit {
  groupList:Group[]|undefined=[];
  filterListGroup: Group[] = [];
  groupListParams: getGroupListParams={userId:undefined}
  isModalOpen: Boolean=false;
  groupSelected:Group|undefined
  joinGroupParam:JoinGroup={userId:undefined,groupId:undefined}
  userAuth:User|undefined
  searchQuery: string = '';

  constructor(private authService: AuthService, private restService: RestService) { }

  async ngOnInit() {
    this.userAuth= await this.authService.getUser() 
    this.getListgroup().then(() => {
      this.applyFilters();
    });;
  }


  async getListgroup(){
    this.groupListParams.userId = this.userAuth?.id;
    await this.restService.getListGroup(this.groupListParams).then((response)=>{
      this.groupList=response.body.data
    })

  }

  OpenModal(group:Group){
    this.groupSelected=group;
    this.isModalOpen=true;
  }

  setOpen(boolean: Boolean){
    this.isModalOpen=boolean;
  }

  async joinGroup(group:Group){
    this.joinGroupParam.userId=this.userAuth?.id
    this.joinGroupParam.groupId=group.id
    await this.restService.joinGroup(this.joinGroupParam).then((response)=>{
      this.setOpen(false);
      this.ngOnInit();
    })
  }

  handleInput(event: any) {
    this.searchQuery = event.target.value?.toLowerCase() || '';
    this.applyFilters();
  }


  applyFilters() {
  
    this.filterListGroup = (this.groupList ?? []).filter(group => {
      const username = group.title?.toLowerCase() || '';
  
      return (
        username.includes(this.searchQuery)
      );
    });
  }
}
