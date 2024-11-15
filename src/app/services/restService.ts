import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



import { WsAbstractService } from './ws-astract.service';
import { Friend, User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {  postGroup } from '../models/postGroup';
import { deleteFriend } from '../models/deleteFriend';
import { convertToHttpParams } from '../helpers/htttpHelper';
import { getGroupListParams } from '../models/getGroupListParams';
import { Group } from '../models/group';

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
      console.log("HOLA");
      console.log(user);
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


  async registerGroup(group: postGroup, photo:File|null): Promise<any> {
    try {
        const formData = new FormData();

        // Verifica si group.photo está definido y es de tipo File
        if (photo instanceof File) {
            formData.append('file', photo);
        } else {
            console.error("Error: group.photo no es un archivo válido.");
        }

        formData.append('group', new Blob([JSON.stringify(group)], { type: 'application/json' }));

        const response = await this.http.post(
            `${this.path}/api/group/create/`,
            formData
            // No agregamos headers aquí
        ).toPromise();

        console.log("Request successful");
        return response;
    } catch (error) {
        console.error("Request failed", error);
        throw error;
    }
}

  async deleteUser(username: string): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return await this.http.delete<User>(
      `${this.path}/api/users/delete/${username}`,
      { headers }
    ).toPromise();
  }

  async listAllUsers(username: string): Promise<User[]| undefined> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const users= await this.http.get<User[]>(
      `${this.path}/api/users/get/allUser/${username}`,
      { headers }
    ).toPromise();

    if (!users) {
      throw new Error('No users found');
    }
    return users;
  }


  async sendRequestFriend(userSend: string|undefined, userReceived: string|undefined): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      const response = await this.http.post(
        `${this.path}/api/friends/sendRequest/`,
        {userSend,userReceived},
        { headers }
      ).toPromise(); 

      console.log("Request successful");
      return response;
    } catch (error) {
      console.error("Request failed", error);
      throw error;
    }
  }

  async listFriendUser(username: string| undefined): Promise<User[]| undefined> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const users= await this.http.get<User[]>(
      `${this.path}/api/friends/MyFriends/${username}`,
      { headers }
    ).toPromise();

    if (!users) {
      throw new Error('No friends found');
    }
    return users;
  }

  async deleteFriend(deleteFriend: deleteFriend): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(deleteFriend);
    try{
      const response = await this.http.delete<Response>(
        `${this.path}/api/friends/MyFriends/`,
        { headers, params, observe: 'response' } // Cambiamos para observar toda la respuesta
    ).toPromise();
    console.log(response)
      return response
    }catch(error){

    }
    
  }


  async getListGroup(groupListParams: getGroupListParams): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(groupListParams);
    return await this.http.get<Group[]>(
        `${this.path}/api/group/list/`,
        { headers,params, observe: 'response' }
      ).toPromise();
    
    
  }
}
