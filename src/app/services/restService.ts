import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



import { WsAbstractService } from './ws-astract.service';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestService  {
  serverUrl = environment.restUrl;
  apiPath = '';
  path = this.serverUrl + this.apiPath;

  constructor(private http: HttpClient) {}

  async register(user: User): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      const response = await this.http.post(
        `${this.path}/api/users/register/`,
        user,
        { headers }
      ).toPromise(); 

      console.log("Request successful");
      return response;
    } catch (error) {
      console.error("Request failed", error);
      throw error;
    }
  }
  


  async editUser(user: User): Promise<any> {
    try {

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      const response = await this.http.put(
        `${this.path}/api/users/edit/`,
        user,
        { headers }
      ).toPromise(); 

      console.log("Request successful");
      return response;
    } catch (error) {
      console.error("Request failed", error);
      throw error;
    }
  }

  async getUser(username: string): Promise<User | undefined> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return await this.http.get<User>(
      `${this.path}/api/users/get/${username}`,
      { headers }
    ).toPromise();
  }
}
