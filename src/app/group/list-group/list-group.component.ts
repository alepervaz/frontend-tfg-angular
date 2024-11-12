import { Component, OnInit } from '@angular/core';
import { getGroupListParams } from 'src/app/models/getGroupListParams';
import { Group } from 'src/app/models/group';
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

  constructor(private authService: AuthService, private restService: RestService) { }

  ngOnInit() {
    this.getListgroup();
  }


  async getListgroup(){
    const user=await this.authService.getUser()
    this.groupListParams.userId = user?.id;
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


}
