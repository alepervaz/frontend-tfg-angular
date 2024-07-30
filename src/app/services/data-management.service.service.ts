
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
}
