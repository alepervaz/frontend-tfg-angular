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
import { JoinGroup } from '../models/joinGroup';
import { getMyGroups } from '../models/getMyGroups';

import { EditGroup } from '../models/EditGroup';
import { DeleteMemberGroup } from '../models/deleteMemberGroup';
import { DeleteGroup } from '../models/DeleteGroup';
import { LeaveGroup } from '../models/LeaveGroup';
import { CreateActivity } from '../models/CreateActivity';
import { Activity } from '../models/Activity/Activity';
import { LoadActivitiesRequest } from '../models/LoadActivityRequest';
import { JoinActivityRequest } from '../models/Activity/JoinActivityRequest';
import { CancelActivityRequest } from '../models/Activity/CancelActivityRequest';
import { EditActivity } from '../models/Activity/EditActivity';
import { PendingPayments } from '../models/Balance/PendingPayments';
import { GetGroupRequest } from '../models/Balance/GetGroupRequest';
import { SendEmailRequest } from '../models/Email/SendEmailRequest';
import { Chat } from '../models/Chat/Chat';
import { Notification } from '../models/Notification';
import { LoadStadisticActivity } from '../models/Activity/LoadStadisticActivity';

@Injectable({
  providedIn: 'root',
})
export class RestService  {
  serverUrl = environment.restUrl;
  apiPath = '';
  path = this.serverUrl + this.apiPath;

  constructor(private http: HttpClient) {}

  async register(user: User): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // try {
      const response = await this.http.post(
        `${this.path}/api/users/register/`,
        user,
        { headers, observe: 'response' }
      ).toPromise();
      return response; 
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
        { headers,observe:'response' }
      ).toPromise(); 

      console.log("Request successful");
      console.log(response)
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
      console.error("Request failed", error);
      throw error;
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


  async joinGroup(joinGroup:JoinGroup): Promise<any> {
    try {
      console.log("hola")
      console.log(joinGroup.groupId)
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response = await this.http.put(
        `${this.path}/api/group/list/`,
        joinGroup,
        {headers,observe:'response'}
      ).toPromise(); 
      return response;
    } catch (error) {
      throw error;
    }
  }

  async listAllMyGroups(groupListParams:getMyGroups): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(groupListParams);
     return await this.http.get(
      `${this.path}/api/group/list-my-groups/`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async deleteMemberGroup(deleteMember: DeleteMemberGroup): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(deleteMember);
    return await this.http.delete<User>(
      `${this.path}/api/group/member/`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async editGroup(group: EditGroup, photo:File|null): Promise<any> {
    try {
        const formData = new FormData();
        console.log(group);
        // Verifica si group.photo está definido y es de tipo File
        if(group.newFoto==true){
          if (photo instanceof File) {
            formData.append('file', photo);
          } else {
              console.error("Error: group.photo no es un archivo válido.");
          }}else{
            console.log("hola")
            photo=new File([], "empty.jpg", { type: "image/jpeg" });
            formData.append('file', photo);
          }
        

        formData.append('group', new Blob([JSON.stringify(group)], { type: 'application/json' }));

        const response = await this.http.put(
            `${this.path}/api/group/`,
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

  async deleteGroup(deleteGroup: DeleteGroup): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(deleteGroup);
    return await this.http.delete<Group>(
      `${this.path}/api/group/`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async leaveGroup(leaveGroup: LeaveGroup): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(leaveGroup);
    return await this.http.delete(
      `${this.path}/api/group/list-my-groups`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async registerActivity(activity:Activity): Promise<any> {
    try {
        
        const response = await this.http.post(
            `${this.path}/api/activity/`,
            activity
        ).toPromise();

        console.log("Request successful");
        return response;
    } catch (error) {
        console.error("Request failed", error);
        throw error;
    }
  }

  async loadActivities(loadActivitiesRequest:LoadActivitiesRequest): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(loadActivitiesRequest);
     return await this.http.get(
      `${this.path}/api/activity`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async joinActivity(joinActivityRequest:JoinActivityRequest): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response = await this.http.post(
        `${this.path}/api/activity/join/`,
        joinActivityRequest,
        {headers,observe:'response'}
      ).toPromise(); 
      return response;
    } catch (error) {
      throw error;
    }
  }

  async cancelActivity(cancelActivityRequest:CancelActivityRequest): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response = await this.http.put(
        `${this.path}/api/activity/cancel`,
        cancelActivityRequest,
        {headers,observe:'response'}
      ).toPromise(); 
      return response;
    } catch (error) {
      throw error;
    }
  }

  async editActivity(editActivity:EditActivity): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response = await this.http.put(
        `${this.path}/api/activity`,
        editActivity,
        {headers,observe:'response'}
      ).toPromise(); 
      return response;
    } catch (error) {
      throw error;
    }
  }

  async confirmedPay(paymentRequest: PendingPayments): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response = await this.http.put(
        `${this.path}/api/activity/confirmedPay/`,
        paymentRequest,
        {headers,observe:'response'}
      ).toPromise(); 
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getGroup(getGroupRequest:GetGroupRequest): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(getGroupRequest);
     return await this.http.get(
      `${this.path}/api/group/myGroup`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async sendEmail(sendEmailRequest: SendEmailRequest): Promise<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const response = await this.http.post(
        `${this.path}/api/sendEmail/`,
        sendEmailRequest,
        {headers,observe:'response'}
      ).toPromise(); 
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getChatsGroups(groupId: string): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return await this.http.get<Chat>(
      `${this.path}/${groupId}`,
      { headers }
    ).toPromise();
  }

  async getNotifications(userId: number): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return await this.http.get<Notification>(
      `${this.path}/api/notification/${userId}`,
      { headers }
    ).toPromise();
  }

  async loadFinishedActivitiesByUser(loadStadisticActivity:LoadStadisticActivity): Promise<any> {
    console.log("rest1",loadStadisticActivity)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(loadStadisticActivity);
     return await this.http.get(
      `${this.path}/api/activity/finishedActivitiesByUser`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

  async loadfindActivitiesWithoutPayment(loadStadisticActivity:LoadStadisticActivity): Promise<any> {
    console.log("rest2",loadStadisticActivity)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = convertToHttpParams(loadStadisticActivity);
     return await this.http.get(
      `${this.path}/api/activity/activitiesWithoutPayment`,
      { headers,params,observe:'response' }
    ).toPromise();
  }

}
