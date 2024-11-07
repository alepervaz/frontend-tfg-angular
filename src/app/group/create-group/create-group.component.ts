import { Component, OnInit } from '@angular/core';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { NavController } from '@ionic/angular';
import { postGroup } from 'src/app/models/postGroup';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent  implements OnInit {

  group: postGroup = new postGroup();
  photo: File|null=null; 

  constructor(private dataManagementService: DataManagementService, private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  async onSubmit() {
    const user=await this.authService.getUser();
    console.log(user)
    this.group.userId=user?.id;
    console.log(this.group)
    this.dataManagementService.registerGroup(this.group, this.photo).then(
      data => {
        console.log(this.group);
        console.log('Group created successfully!', data);
        this.navCtrl.navigateRoot('/group');
      },
      error => {
        console.error('Error registering group!', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.photo = event.target.files[0];
  }

}
