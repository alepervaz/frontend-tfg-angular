import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) { }

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
  
}
