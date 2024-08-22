import { Component, OnInit } from '@angular/core';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { NavController } from '@ionic/angular';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent  implements OnInit {

  group: Group = new Group();

  constructor(private dataManagementService: DataManagementService, private navCtrl: NavController) { }

  ngOnInit() {}

  async onSubmit() {
    this.dataManagementService.registerGroup(this.group).then(
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

}
