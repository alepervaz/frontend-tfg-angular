import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { Group } from 'src/app/models/group';
import { RestService } from 'src/app/services/restService';
import { LoadActivitiesRequest } from 'src/app/models/LoadActivityRequest';
import { LoadActivitiesResponse, StatusActivity } from 'src/app/models/LoadActivityResponse';
import { JoinActivityRequest } from 'src/app/models/Activity/JoinActivityRequest';
import { User } from 'src/app/models/user';
import { CancelActivityRequest } from 'src/app/models/Activity/CancelActivityRequest';
import { Activity } from 'src/app/models/Activity/Activity';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  group: Group = new Group();
  activities: LoadActivitiesResponse[] | undefined;
  joinActivityRequest: JoinActivityRequest= new JoinActivityRequest();
  userAuth:User|undefined;

  // Estructura para agrupar actividades por fecha:
  // groupedActivities será un array en el que cada elemento 
  // tendrá { date: string, activities: LoadActivitiesResponse[] }
  groupedActivities: { date: string; activities: LoadActivitiesResponse[] }[] = [];

  isModalOpen = false;
  selectedActivity: LoadActivitiesResponse | null = null;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private restService: RestService,
  ) {}

  async ngOnInit() {
    const navigation = window.history.state;
    this.group = navigation.group;
    await this.authService.getUser().then(data=>
      this.userAuth=data
    )
    await this.loadActivities();
    

  }

  goToCreateActivity(group: Group) {
    this.navCtrl.navigateRoot('create-activity', {
      state: { group },
    });
  }

  async loadActivities() {
    const loadActivitiesRequest: LoadActivitiesRequest = { groupId: this.group.id };
    const response = await this.restService.loadActivities(loadActivitiesRequest);
    this.activities = response.body.data;
    if(this.activities){this.activities.forEach(activity => {
      activity.isJoined = this.isJoined(activity);
    });}
  
    if (this.activities && this.activities.length > 0) {
      this.groupActivitiesByDate();
    }
  }
  

  groupActivitiesByDate() {
    const activitiesByDate: { [key: string]: LoadActivitiesResponse[] } = {};
  
    for (const activity of this.activities!) {
      if (activity.startDate) {
        const date = new Date(activity.startDate);
        const dateStr = this.formatDate(date);
  
        if (!activitiesByDate[dateStr]) {
          activitiesByDate[dateStr] = [];
        }
        activitiesByDate[dateStr].push(activity);
      }
    }
  
    const sortedDates = Object.keys(activitiesByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  
    this.groupedActivities = sortedDates.map(date => {
      return { date: date, activities: activitiesByDate[date] };
    });
  }
  

  // Método para formatear la fecha en el formato que desees, por ejemplo "dd/MM/yyyy"
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    // Ajusta el formato según necesites
    return `${year}-${month}-${day}`;
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'deporte':
        return 'football-outline';
      case 'lectura':
        return 'book-outline';
      case 'musica':
        return 'musical-notes-outline';
      default:
        return 'help-circle-outline';
    }
  }

  viewDetails(activity: LoadActivitiesResponse) {
    this.selectedActivity = activity;
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedActivity = null;
  }

  joinActivity(activity: LoadActivitiesResponse) {
    // Implementa la lógica para unirte a la actividad
    this.joinActivityRequest={activityId:activity.activityId,userId:this.userAuth?.id}
    this.restService.joinActivity(this.joinActivityRequest).then((response)=>{
      console.log(response)
    })
  }

  isJoined(activity: LoadActivitiesResponse) {
    if (!this.userAuth || !activity.participantes) { 
      console.log("2hola")
      return false; 
    }
    return activity.participantes.some(part => part.id === this.userAuth!.id);
  }

  isAdministrator(){
    if(this.group.admin?.id==this.userAuth?.id)return true;
    return false
  }

  
  async cancelActivity(activity:LoadActivitiesResponse){
    const cancelActivityRequest=new CancelActivityRequest();
    cancelActivityRequest.activityId=activity.activityId;
    this.restService.cancelActivity(cancelActivityRequest).then((response)=>{
      console.log(response)
      this.loadActivities();
    })

  }

  getStatusColor(status: StatusActivity): string {
    switch (status) {
      case StatusActivity.ACTIVE:
        return 'success';
      case StatusActivity.CANCELLED:
        return 'danger';     
      case StatusActivity.FINISHED:
        return 'warning';   
      default:
        return 'medium';     
    }
  }

  async goToEditActivity(editActivity:LoadActivitiesResponse){
    const activity=new Activity();
    activity.title=editActivity.title;
    activity.description=editActivity.description;
    activity.startDate=editActivity.startDate;
    activity.endDate=editActivity.endDate;
    activity.price=editActivity.price;
    activity.id=editActivity.activityId;
    this.navCtrl.navigateRoot('create-activity', {
      state: { activity: activity,
        group:this.group }
    });
  }

}
