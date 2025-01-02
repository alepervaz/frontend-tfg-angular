import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity/Activity';
import { CreateActivity } from 'src/app/models/CreateActivity';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { NavController,MenuController,InfiniteScrollCustomEvent,PopoverController } from '@ionic/angular';

import { RestService } from 'src/app/services/restService';
import { AuthService } from 'src/app/services/auth.service';
import { ToastHelperService } from 'src/app/helpers/AlertHelper';
import { EditActivity } from 'src/app/models/Activity/EditActivity';

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
  editMode=false;
  constructor(private restService:RestService,private navCtrl: NavController,private authService: AuthService,private toastService: ToastHelperService) { }

  async ngOnInit() {
    const navigation = window.history.state;
    this.group=navigation.group;
    await this.getUser();
    if(navigation.activity){
      this.activity=navigation.activity;
      console.log("hola")
      console.log(this.activity)
      this.editMode=true;
    }
    
  }


  onSubmit(){
    if(this.editMode){
      console.log("hola");
      console.log(this.activity);
      const editActivity=new EditActivity();
      editActivity.title=this.activity.title;
      editActivity.description=this.activity.description;
      editActivity.startDate=this.activity.startDate;
      editActivity.endDate=this.activity.endDate;
      editActivity.price=this.activity.price;
      editActivity.activityId=this.activity.id;
      this.restService.editActivity(editActivity).then((response)=>{
        console.log(response.body)
        this.toastService.presentToast(response.body.message,undefined,'bottom','success')
        this.navCtrl.navigateRoot('/activities', {
          state: { group:this.group }
        });
      })
      
    }else{
      const createActivity: CreateActivity={...this.activity,groupId:this.group.id,userId:this.userAuth?.id}
      this.restService.registerActivity(createActivity).then((response)=>{
        this.toastService.presentToast(response.message,undefined,'bottom','success')
        this.navCtrl.navigateRoot('/activities', {
          state: { group:this.group }
        });
        
      })
    }
    
  }

  async getUser(): Promise<User|undefined>{
      return await this.authService.getUser().then(data=>
        this.userAuth=data
      )
    }
  

    
}
