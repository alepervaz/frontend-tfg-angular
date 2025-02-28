import { Component, OnInit } from '@angular/core';
import { ActionSheetController, InfiniteScrollCustomEvent, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pin, share, trash } from 'ionicons/icons';
import { NavController, MenuController } from '@ionic/angular';
import { Friend, User } from 'src/app/models/user';
import { DataManagementService } from 'src/app/services/data-management.service.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent implements OnInit {
  listUser: User[] = [];
  filterListUser: User[] = [];
  userAuth: User | undefined;
  searchQuery: string = '';
  // Rango de valoración: suponiendo escala de 0 a 10
  ratingRange: number[] = [0, 5];
  // Rango de cantidad de amigos: suponiendo un máximo de 100 (puedes ajustarlo)
  friendRange: number[] = [0, 100];

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private dataManagementService: DataManagementService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.listAllUser().then(() => {
      this.applyFilters();
    });

    this.authService.getUser().then(user => {
      this.userAuth = user;
    });
  }

  async listAllUser(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const username = decodedToken.sub; // Aquí `sub` corresponde al subject, que es el username.
      const users: User[] | undefined = await this.dataManagementService.listAllUser(username);
      this.listUser = [...(users ?? [])];
    }
  }

  onIonInfinite(ev: any) {
    this.listAllUser();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  // Actualiza la búsqueda por nombre y aplica todos los filtros
  handleInput(event: any) {
    this.searchQuery = event.target.value?.toLowerCase() || '';
    this.applyFilters();
  }

  // Filtra la lista combinando búsqueda por nombre, rango de valoración y cantidad de amigos
  applyFilters() {
  
    this.filterListUser = (this.listUser ?? []).filter(user => {
      const username = user.username?.toLowerCase() || '';
      // Convierto la valoración a número; si es undefined, asigno 0.
      const rating = user.valuation !== undefined ? Number(user.valuation) : 0;
      const friendsCount = user.friends ? user.friends.length : 0;
  
      return (
        username.includes(this.searchQuery) &&
        rating >= Number(this.ratingRange[0]) &&
        rating <= Number(this.ratingRange[1]) &&
        friendsCount >= Number(this.friendRange[0]) &&
        friendsCount <= Number(this.friendRange[1])
      );
    });
  }
  
  
  
  onRatingChange(event: any) {
    // event.detail.value => { lower: number, upper: number }
    const { lower, upper } = event.detail.value;
    this.ratingRange = [lower, upper];
    this.applyFilters();
  }
  
  onFriendChange(event: any) {
    const { lower, upper } = event.detail.value;
    this.friendRange = [lower, upper];
    this.applyFilters();
  }
  
  async sendRequestFriend(userReceived: string | undefined): Promise<void> {
    const userSend = await this.authService.getUser();
    if (userReceived) {
      await this.dataManagementService.sendRequestFriend(userSend?.username, userReceived);
      this.ngOnInit();
    } else {
      this.showErrorToast();
    }
  }

  async showErrorToast() {
    const toast = await this.toastController.create({
      message: 'Error: Usuario no válido o indefinido.',
      duration: 2000, // Duración en milisegundos
      color: 'danger', // Color del toast (opcional)
      position: 'bottom', // Posición: 'top', 'middle' o 'bottom'
    });
    await toast.present();
  }

  isFriend(user: Friend[] | undefined): boolean | undefined {
    return this.userAuth?.friends?.some(friend => user?.find(f => f.id === friend.id));
  }
}
