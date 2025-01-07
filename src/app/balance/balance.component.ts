import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RestService } from '../services/restService';
import { ToastHelperService } from '../helpers/AlertHelper';
import { NavController,MenuController,InfiniteScrollCustomEvent,PopoverController } from '@ionic/angular';
import { Group } from '../models/group';
@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent  implements OnInit {

  group:Group=new Group;
  // Control para el ion-segment (o tabs)
  selectedSegment: string = 'balances';
  listaBalances = [
    { nombre: 'Alex (Tú)', monto: 141.25 },
    { nombre: 'Brian', monto: -63.75 },
    { nombre: 'Julia', monto: 21.25 },
    { nombre: 'Thomas', monto: -98.75 }
  ];
  
  //Total que te deben a ti
  totalOwed: number = 141.25;

  // Para la sección de gastos (ejemplo)
  misGastos: number = 98.75;
  gastosTotales: number = 395.00;
  constructor( private authService: AuthService, private navCtrl: NavController,
      private menuCtrl: MenuController,
    private restService:RestService,private popoverController: PopoverController,private toastService: ToastHelperService) { }

  ngOnInit() {
    const navigation = window.history.state;
    if (navigation && navigation.group) {
      this.group = navigation.group;
      console.log(this.group)
    }
  }


  
}
