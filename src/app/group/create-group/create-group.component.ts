import { Component, OnInit } from '@angular/core';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { NavController } from '@ionic/angular';
import { postGroup } from 'src/app/models/postGroup';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/models/group';
import { RestService } from 'src/app/services/restService';
import { EditGroup } from 'src/app/models/EditGroup';
import { DeleteGroup } from 'src/app/models/DeleteGroup';
import { ToastHelperService } from 'src/app/helpers/AlertHelper';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent  implements OnInit {

  group: postGroup = new postGroup();
  photo: File|null=null;
  isEditMode=false;
  newPhoto=false;
  showPhoto: string | null = null; 

  constructor(private dataManagementService: DataManagementService,private restService:RestService, private navCtrl: NavController,
    private authService: AuthService,private toastService: ToastHelperService
  ) { }

  ngOnInit() {
    const navigation = window.history.state;
    if (navigation && navigation.group) {
      this.group = navigation.group;
      this.photo=navigation.group.photo;
      this.showPhoto=navigation.group.photo;
      this.isEditMode=true;
      console.log(navigation.group.photo)
      if(this.photo!=null) this.newPhoto=false;
      console.log('Received Group:', this.group);
    }
  }

  async onSubmit() {
    const user=await this.authService.getUser();
    this.group.userId=user?.id;
    if(this.isEditMode){
      const editGroup=new EditGroup()
      editGroup.groupId=this.group.id;
      editGroup.title=this.group.title;
      editGroup.description=this.group.description;
      editGroup.newFoto=this.newPhoto;
      this.restService.editGroup(editGroup, this.photo).then(
        data => {
          console.log('Group created successfully!', data);
          this.navCtrl.navigateRoot('/group');
        },
        error => {
          console.error('Error editing group!', error);
        }
      );
    }else{
      this.dataManagementService.registerGroup(this.group, this.photo).then(
        data => {
          console.log('Group created successfully!', data);
          this.navCtrl.navigateRoot('/group');
        },
        error => {
          console.error('Error registering group!', error);
        }
      );
    }
    
  }
  async deleteGroup(group:postGroup){
    const deleteGroupParam=new DeleteGroup();
    deleteGroupParam.groupId=group.id;
    console.log(deleteGroupParam)
    await this.restService.deleteGroup(deleteGroupParam).then((response)=>{
      console.log(response)
      this.navCtrl.navigateRoot('/group');
      this.toastService.presentToast(response.data.message,undefined,'bottom','success')
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
  if (file) {
    this.photo = file;
    this.showPhoto = file.name; // Almacena el nombre del archivo
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.showPhoto = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  clearPhoto() {
    this.newPhoto=true;
    this.photo = null;
    this.showPhoto=null
  }

}
