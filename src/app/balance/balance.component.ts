import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RestService } from '../services/restService';
import { ToastHelperService } from '../helpers/AlertHelper';
import { NavController,MenuController,InfiniteScrollCustomEvent,PopoverController } from '@ionic/angular';
import { Group } from '../models/group';
import { Activity } from '../models/Activity/Activity';
import { User } from '../models/user';
import { StatusActivity } from '../models/LoadActivityResponse';
import { BalanceItem } from '../models/balance';
@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent  implements OnInit {

  group:Group=new Group;
  activities: Activity[]|undefined;
  // Control para el ion-segment (o tabs)
  selectedSegment: string = 'balances';
  
  listaBalances: BalanceItem[] = [];
  userAuth:User|undefined;
  //Total que te deben a ti
  totalOwed: number = 0;
  totalDebt:number=0;

  // Para la sección de gastos (ejemplo)
  misGastos: number = 98.75;
  gastosTotales: number=0;
  constructor( private authService: AuthService, private navCtrl: NavController,
      private menuCtrl: MenuController,
    private restService:RestService,private popoverController: PopoverController,private toastService: ToastHelperService) { }

  async ngOnInit() {
    this.userAuth= await this.authService.getUser() 
    const navigation = window.history.state;
    if (navigation && navigation.group) {
      this.group = navigation.group;
      this.activities=this.group.actividades;
      this.totalHistoryPrice();
      // this.debtToMe();
      this.balance();
      // this.debtYou();
      this.debtOweToMe();
      console.log(this.listaBalances)
      console.log(this.group)
      console.log(this.activities)
    }
    console.log(this.userAuth)
  }

  totalHistoryPrice(){
    if(this.activities)
    this.gastosTotales=this.activities.map(activity=>activity.price ?? 0).reduce((acumulado, precioActual) => acumulado + precioActual, 0);
  }

  // debtToMe() {
  //   this.totalOwed = (this.activities ?? [])
  //     .filter(activity =>
  //       activity.statusActivity === StatusActivity.ACTIVE &&
  //       activity.organizador?.id == this.userAuth?.id
  //     )
  //     .reduce((acumulado, activity) => acumulado + ((activity.price ?? 0)/(activity.participantes?.length ?? 1)), 0);
  // }

  // debtYou() {
  //   this.totalDebt = (this.activities ?? [])
  //     .filter(activity =>
  //       activity.statusActivity === StatusActivity.ACTIVE &&
  //       activity.organizador?.id != this.userAuth?.id
  //     )
  //     .reduce((acumulado, activity) => {
  //       if(){
  //         return acumulado + ((activity.price ?? 0)/(activity.participantes?.length ?? 1))
  //       }else if(){

  //       }else{
  //         acumulado + ((activity.price ?? 0)/(activity.participantes?.length ?? 1))
  //       }
  //     }, 0);
  // }

  balance(){
    this.listaBalances = (this.group.miembros ?? []).map(user => {
    const name = user.username;
  
    const monto = (this.activities ?? [])
      .filter(activity =>
        activity.participantes?.some(participant => activity.statusActivity==StatusActivity.ACTIVE && participant.id === user.id )
      )
      .reduce((acumulador, activity) => {
        if ((activity.participantes?.length ?? 1)>1 && activity.organizador?.id === user.id) {
          return acumulador - ((activity.price ?? 0)/(activity.participantes?.length ?? 1));
        } else if((activity.participantes?.length ?? 1)==1) {
          return acumulador;
        }else{
          return acumulador + ((activity.price ?? 0)/(activity.participantes?.length ?? 1));
        }
      }, 0);

    return {
      nombre: name,
      monto: monto
    };
  });

  }
  
  debtOweToMe() {
    const myBalance = this.listaBalances.find(
      balance => balance.nombre === this.userAuth?.username
    );
  
    if (myBalance?.monto && myBalance.monto >= 0) {
      // Guarda el valor absoluto de myBalance.monto en totalOwed
      this.totalOwed = Math.abs(myBalance.monto);
    } else if (myBalance?.monto && myBalance.monto < 0) {
      // Guarda el valor absoluto de myBalance.monto en totalDebt
      this.totalDebt = Math.abs(myBalance.monto);
    } else {
      this.totalDebt = 0;
      this.totalOwed = 0;
    }
  }
  
  
}
