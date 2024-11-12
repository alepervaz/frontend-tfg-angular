import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { DataManagementService } from './data-management.service.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService, private dataManagementService: DataManagementService) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiURL}/authenticate`, { username, password })
      .pipe(map(response => {
        localStorage.setItem('token', response.jwt);
        return true;
      }));
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
