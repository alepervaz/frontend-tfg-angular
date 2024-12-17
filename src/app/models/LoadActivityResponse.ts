import { Group } from "./group";
import { User } from "./user";

export class LoadActivitiesResponse{
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
}