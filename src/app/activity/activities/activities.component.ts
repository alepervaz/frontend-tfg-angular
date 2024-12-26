import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { Group } from 'src/app/models/group';
import { RestService } from 'src/app/services/restService';
import { LoadActivitiesRequest } from 'src/app/models/LoadActivityRequest';
import { LoadActivitiesResponse } from 'src/app/models/LoadActivityResponse';
import { JoinActivityRequest } from 'src/app/models/Activity/JoinActivityRequest';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  group: Group = new Group();
  activities: LoadActivitiesResponse[] | undefined;
  joinActivityRequest: JoinActivityRequest= new JoinActivityRequest();
  user:User|undefined;

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
      this.user=data
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
    
  
    console.log('Actividades recibidas:', this.activities);
  
    if (this.activities && this.activities.length > 0) {
      this.groupActivitiesByDate();
      console.log('Actividades agrupadas:', this.groupedActivities);
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
    console.log('Ver detalles de la actividad', activity);
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedActivity = null;
  }

  joinActivity(activity: LoadActivitiesResponse) {
    // Implementa la lógica para unirte a la actividad
    this.joinActivityRequest={activityId:activity.activityId,userId:this.user?.id}
    this.restService.joinActivity(this.joinActivityRequest).then((response)=>{
      console.log(response)
    })
  }

  isJoined(activity: LoadActivitiesResponse) {
    console.log(this.user)
    console.log(activity.participantes)
    if (!this.user || !activity.participantes) { 
      console.log("2hola")
      return false; 
    }
    console.log(activity.participantes.some(part => part.id === this.user!.id))
    return activity.participantes.some(part => part.id === this.user!.id);
  }

  
}
