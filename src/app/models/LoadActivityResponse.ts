import { Group } from "./group";
import { User } from "./user";

export class LoadActivitiesResponse{
    activityId?:number;
    title?:string;
    description?:string;
    startDate?:Date;
    endDate?:Date;
    registerDate?:Date;
    payDate?:Date;
    price?:number;
    groupId?:number;
    grupos?:Group[];
    organizador?:User;
    participantes?:User[];
    isJoined?:boolean;
    statusActivity?:StatusActivity;
}

export enum StatusActivity {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    FINISHED = 'FINISHED'
  }
  