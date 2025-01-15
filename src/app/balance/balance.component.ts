import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RestService } from '../services/restService';
import { ToastHelperService } from '../helpers/AlertHelper';
import { NavController,MenuController,InfiniteScrollCustomEvent,PopoverController } from '@ionic/angular';
import { Group } from '../models/group';
import { Activity } from '../models/Activity/Activity';
import { User } from '../models/user';
import { StatusActivity } from '../models/LoadActivityResponse';
import { BalanceItem } from '../models/Balance/Balance';
import { PendingPayments } from '../models/Balance/PendingPayments';
import { GetGroupRequest } from '../models/Balance/GetGroupRequest';
import { ExpenseItem } from '../models/Balance/ExpenseItem';
import { ActivityPayment } from '../models/Activity/ActivityPayment';

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
  myBalance:BalanceItem|undefined;
  userAuth:User|undefined;
  expenseList:ExpenseItem[]|undefined;
  

  // Para la sección de gastos (ejemplo)
  misGastos: number = 98.75;
  gastosTotalesGroup: number=0;
  myGastosTotales: number=0;

  //pagos
  currentDate: Date = new Date();
  // Ejemplo de propiedades en tu componente
  totalPendingAmount: number = 0; // Total de lo que te adeudan
  
  pendingPayments : PendingPayments[]=[];

  //
  constructor( private authService: AuthService, private navCtrl: NavController,
      private menuCtrl: MenuController,
    private restService:RestService,private popoverController: PopoverController,private toastService: ToastHelperService) { }

  async ngOnInit() {
    this.userAuth= await this.authService.getUser() 
    const navigation = window.history.state;
    if (navigation && navigation.groupId) {
      const getGroup=new GetGroupRequest();
      getGroup.groupId=navigation.groupId;
      this.restService.getGroup(getGroup).then((response)=>{
        console.log(response)
        this.group=response.body.data
        this.activities=this.group.actividades;
        console.log(this.activities)
        this.theTotalGroupBill();
        this.myTotalHistoryPay();
        this.balance();
        this.myOwnBalance();
        this.listPendingPayments();
        this.myTotalPendingAmount();
      })
      
      
    }
    
  }



  balance() {
    // Recorremos cada miembro del grupo para calcular su balance
    this.listaBalances = (this.group.miembros ?? []).map((user) => {
      const name = user.username;
  
      // Suma de lo que debe o le deben en todas las actividades activas
      const monto = (this.activities ?? [])
        // Filtramos las actividades relevantes:
        // 1) El usuario debe ser participante de la actividad
        // 2) La actividad debe estar activa
        // 3) Debe existir un precio asignado
        .filter(activity =>
          activity.participantes?.some(participant => participant.id === user.id) &&
          activity.statusActivity === StatusActivity.ACTIVE &&
          activity.price != null
        )
        // Reducimos para obtener el balance total del usuario (acumulador)
        .reduce((acumulador, activity) => {
          // Cantidad total de participantes y pagadores
          const totalParticipantes = activity.participantes?.length ?? 0;
          const totalPagadores = activity.activityPayments?.length ?? 0;
          
          // Coste por persona, asumiendo reparto equitativo
          const costePorPersona = (activity.price ?? 0) / totalParticipantes;
  
          // Verificamos si el usuario es el organizador
          if (activity.organizador?.id === user.id) {
            // Caso 1: El organizador cubre lo de quienes faltan por pagar
            // Si hay menos pagadores que participantes,
            // se asume que el organizador adelantó la parte de los que faltan por pagar
            if (totalPagadores < totalParticipantes) {
              const faltanPorPagar = totalParticipantes - totalPagadores;
              // El organizador está cubriendo "faltanPorPagar * costePorPersona"
              // Como ese dinero se lo deben a él, se resta (resultado negativo)
              return acumulador - (costePorPersona * faltanPorPagar);
            }
            // Si todos pagaron, el organizador no adelantó nada extra
            return acumulador;
          } else {
            // Caso 2: El usuario NO es el organizador
            // Comprobamos si el usuario está en la lista de pagadores
            const esPagador = activity.activityPayments?.some(payment => payment.userId === user.id) ?? false;
  
            // Si el usuario NO pagó su parte, debe sumarse a lo que debe
            // (un monto positivo indica que el usuario todavía no ha cubierto su parte)
            if (!esPagador) {
              return acumulador + costePorPersona;
            }
  
            // Si el usuario pagó su parte, no modifica el balance
            return acumulador;
          }
        }, 0);
  
      // Devolvemos un objeto con el nombre y su balance (monto)
      return {
        nombre: name,
        monto: monto
      };
    });
  }
  
  
  
  
  myTotalPendingAmount() {
    this.totalPendingAmount=this.pendingPayments?.reduce((acumulador,payment)=>{
      if(payment.amount!=null)return acumulador+payment.amount;
      return acumulador;
    },0)
  }

  myOwnBalance(){
    console.log(this.userAuth?.username)
    this.myBalance=this.listaBalances.find(balance=>balance.nombre===this.userAuth?.username)
  }

  listPendingPayments() {
    this.pendingPayments = (this.activities ?? [])
      .filter(activity => activity.statusActivity === StatusActivity.ACTIVE && activity.price != null && activity.organizador?.id == this.userAuth?.id)
      .reduce((acumulador, activity) => {
        // Generar objetos PendingPayments para los participantes que no son pagadores
        const nuevosObjetos = activity.participantes
          ?.filter(participant => participant.id !== this.userAuth?.id) // Excluir al usuario autenticado
          .map(participant => {
            if (!activity.activityPayments?.some(payment => payment.userId === participant.id)) {
              const pending = new PendingPayments();
              pending.activityId = activity.id;
              pending.userId = participant.id;
              pending.payerName = participant.username;
              pending.activityDescription = activity.description;
              if (activity.price != null && activity.participantes != null && activity.price !== 0) {
                pending.amount = activity.price / activity.participantes.length;
              }
              if (activity.startDate != null) {
                pending.dueDate = new Date(activity.startDate);
              }
              pending.userPhoto = participant.avatar;
              return pending;
            }
            return null; // Retorna null si no cumple la condición
          })
          ?.filter((item): item is PendingPayments => item !== null) || []; // Filtrar valores null
  
        // Concatenar los nuevos objetos al acumulador
        return acumulador.concat(nuevosObjetos);
      }, [] as PendingPayments[]);
  }
  
  
  
  
  remindAllDebtors() {
    // Lógica para enviar recordatorio a todos
    console.log('Enviando recordatorio a todos los deudores...');
  }

  onPaymentAction(paymentRequest: PendingPayments) {
    this.restService.confirmedPay(paymentRequest).then((response)=>{
      this.ngOnInit();
    })
  }

  myTotalHistoryPay(){
    this.myGastosTotales=this.activities?.reduce((acumulador,activity)=>{
      if(activity.participantes?.some(participant=>participant.id==this.userAuth?.id) && activity.price!=null){
        return acumulador+activity.price;
      }else{
        return acumulador;
      }
    },0)??0
  }

  theTotalGroupBill(){
    if(this.activities)
    this.gastosTotalesGroup=this.activities.map(activity=>activity.price ?? 0).reduce((acumulado, precioActual) => acumulado + precioActual, 0);
  }

  // myExpensesList(){
  //   this.expenseList = this.activities
  // ?.filter((activity: Activity) =>
  //   activity.activityPayments?.some((pagador: ActivityPayment) => pagador.id === this.userAuth?.id)
  // )
  // .flatMap((activity: Activity) =>
  //   activity.activityPayments
  //     ?.filter((payment: ActivityPayment) => payment.id === this.userAuth?.id)
  //     .map((payment: ActivityPayment) => ({
  //       date: payment.paymentDate || new Date(),
  //       descripcion: activity.description || '',
  //       amount: payment.amountPaid || 0
  //     } as ExpenseItem))
  // )
  // .filter((item: ExpenseItem | undefined) => item !== undefined);

  // }
}
