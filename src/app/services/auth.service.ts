import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { DataManagementService } from './data-management.service.service';
import { jwtDecode } from 'jwt-decode';
import { ToastHelperService } from '../helpers/AlertHelper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService, private dataManagementService: DataManagementService,private toastService: ToastHelperService) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiURL}/authenticate`, { username, password })
      .pipe(
        map(response => {
          localStorage.setItem('token', response.jwt);
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error en login:', error);
          
          // Extraer el mensaje del servidor
          const errorMessage = error.error?.message || 'Error desconocido durante el login';
          // Para desarrollo: ver mensaje técnico
          const devMessage = error.error?.developerMessage || ''; 
          
          // Puedes manejar diferentes códigos de estado aquí si es necesario
          if (error.status === 500) {
            if(devMessage=='Bad credentials'){
              this.toastService.presentToast('Credenciales incorrectas', undefined, 'bottom', 'danger');
            }
            console.error('Error del servidor:', devMessage);
          }
          
          // Relanzar el error para manejo en el componente
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  async getUser():  Promise<User | undefined>{
    const token = localStorage.getItem('token');
    const user= new User;
    if (token) {
    const decodedToken: any = jwtDecode(token);
    const username = decodedToken.sub;  // Aquí `sub` corresponde al subject, que es el username.  
    return await this.dataManagementService.getUser(username); 
  }else{
    return user;
  }
  
  }
  
}
