
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from './restService';
import { User } from '../models/user';
import { postGroup } from '../models/postGroup';
import { deleteFriend } from '../models/deleteFriend';

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

  async registerGroup(group: postGroup,photo:File|null): Promise<any> {
    return this.rest.registerGroup(group,photo)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async deleteUser(username: string): Promise<any> {
    return this.rest.deleteUser(username)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async listAllUser(username: string): Promise<User[] | undefined> {
    return this.rest.listAllUsers(username)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async sendRequestFriend(userSend: string|undefined, userReceived: string|undefined): Promise<void> {
    return this.rest.sendRequestFriend(userSend,userReceived)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async listFriendUser(username: string|undefined): Promise<User[] | undefined> {
    return this.rest.listFriendUser(username)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }

  async deleteFriend(deleteFriend: deleteFriend): Promise<any> {
    return this.rest.deleteFriend(deleteFriend)
    .then((data)=>data)
    .catch((err)=>{
      return err
    });
  }
}
