import { StatusActivity } from "../LoadActivityResponse";
import { User } from "../user";
import { ActivityPayment } from "./ActivityPayment";

export class Activity{
    id?:number;
    title?:string;
    description?:string;
    startDate?:Date;
    endDate?:Date;
    registerDate?:Date;
    payDate?:Date;
    price?:number;
    groupId?:number;
    statusActivity?:StatusActivity;
    organizador?:User;
    participantes?:User[];
    activityPayments?: ActivityPayment[];
    maxParticipant?:number;
}