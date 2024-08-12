
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from './restService';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class DataManagementService {

  constructor(private rest: RestService) { }
  
 async register(user: User): Promise<any> {
    return this.rest.register(user)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async editUser(user: User): Promise<any> {
    return this.rest.editUser(user)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async getUser(username: string): Promise<User> {
    return this.rest.getUser(username)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  
}
