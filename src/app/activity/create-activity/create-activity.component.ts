import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity/Activity';
import { CreateActivity } from 'src/app/models/CreateActivity';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { NavController,MenuController,InfiniteScrollCustomEvent,PopoverController } from '@ionic/angular';

import { RestService } from 'src/app/services/restService';
import { AuthService } from 'src/app/services/auth.service';
import { ToastHelperService } from 'src/app/helpers/AlertHelper';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss'],
})
export class CreateActivityComponent  implements OnInit {
  activity:Activity= new Activity();
  isEditMode:boolean=false;
  group:Group=new Group();
  userAuth:User|undefined;
  constructor(private restService:RestService,private navCtrl: NavController,private authService: AuthService,private toastService: ToastHelperService) { }

  async ngOnInit() {
    const navigation = window.history.state;
    this.group=navigation.group;
    await this.getUser()
    console.log(this.group)
  }


  onSubmit(){
    const createActivity: CreateActivity={...this.activity,groupId:this.group.id,userId:this.userAuth?.id}
    this.restService.registerActivity(createActivity).then((response)=>{
      this.toastService.presentToast(response.message,undefined,'bottom','success')
      this.navCtrl.navigateRoot('/activities', {
        state: { group:this.group }
      });
      
    })
  }

  async getUser(): Promise<User|undefined>{
      return await this.authService.getUser().then(data=>
        this.userAuth=data
      )
    }
  
}
