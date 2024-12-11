import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss'],
})
export class CreateActivityComponent  implements OnInit {
  activity:Activity= new Activity();
  isEditMode:boolean=false;
  constructor() { }

  ngOnInit() {}


  onSubmit(){
    console.log("hola")
  }
}
