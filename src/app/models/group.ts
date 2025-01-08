import { Activity } from "./Activity/Activity";
import { User } from "./user";

export class Group {
    id?: number;
    title?: string;
    description?: string;
    photo?: string; // Para almacenar la foto en Base64
    miembros?: User[];
    admin?:User;
    actividades?:Activity[];
}