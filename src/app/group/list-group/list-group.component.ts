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
  groupListParams: getGroupListParams={userId:undefined}
  isModalOpen: Boolean=false;
  groupSelected:Group|undefined
  joinGroupParam:JoinGroup={userId:undefined,groupId:undefined}
  userAuth:User|undefined

  constructor(private authService: AuthService, private restService: RestService) { }

  async ngOnInit() {
    this.userAuth= await this.authService.getUser() 
    this.getListgroup();
  }


  async getListgroup(){
    this.groupListParams.userId = this.userAuth?.id;
    await this.restService.getListGroup(this.groupListParams).then((response)=>{
      console.log(response.body.data)
      this.groupList=response.body.data
      console.log(this.groupList)
    })

  }

  OpenModal(group:Group){
    this.groupSelected=group;
    console.log(group)
    this.isModalOpen=true;
  }

  setOpen(boolean: Boolean){
    this.isModalOpen=boolean;
  }

  async joinGroup(group:Group){
    this.joinGroupParam.userId=this.userAuth?.id
    this.joinGroupParam.groupId=group.id
    console.log(this.joinGroupParam)
    await this.restService.joinGroup(this.joinGroupParam).then((response)=>{
      this.setOpen(false);
      this.ngOnInit();
    })
  }

}
