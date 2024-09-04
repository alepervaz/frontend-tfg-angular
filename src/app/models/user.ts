export class User {
    username?: string;
    dni?:string;
    email?: string;
    password?: string;
    gender?: Gender;
    avatar?: string;
    birthday?:Date;
    valuation?: number;
  }

  export enum Gender {
    MASCULINO ='Masculino', 
    FEMENINO = 'Femenino',
    OTRO = 'Otro'
  }

  export function obtenerValoresEnum(enumObj: any): string[] {
    return Object.keys(enumObj).map(key => enumObj[key]);
  }

  