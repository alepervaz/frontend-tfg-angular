export class User {
    id?:number;
    username?: string;
    dni?:string;
    email?: string;
    password?: string;
    gender?: Gender;
    avatar?: string;
    birthday?:Date;
    valuation?: number;
    friends?: Friend[];
  }

  export class RegisterUser {
    username?: string;
    dni?:string;
    email?: string;
    password?: string;
    gender?: Gender;
    avatar?: string;
    birthday?:Date;
  }

  export class EditUser {
    id?:number;
    username?: string;
    dni?:string;
    email?: string;
    password?: string;
    gender?: Gender;
    avatar?: string;
    birthday?:Date;
  }

  export class Friend {
    id?: number;
    requestDate?:Date;
    blockDate?:Date;
    users?:User[];

  }
  export enum Gender {
    MASCULINO ='Masculino', 
    FEMENINO = 'Femenino',
    OTRO = 'Otro'
  }

  export function obtenerValoresEnum(enumObj: any): string[] {
    return Object.keys(enumObj).map(key => enumObj[key]);
  }

  