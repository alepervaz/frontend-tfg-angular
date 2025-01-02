import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent  implements OnInit {

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
  constructor() { }

  ngOnInit() {}

}
