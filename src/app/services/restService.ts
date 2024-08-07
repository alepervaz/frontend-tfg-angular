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
      console.log(user);
      console.log(`${this.path}/api/users/register/`);

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
  

}
