export interface Users {
  users: User[];
}
export interface User {
  id?:number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  selected?: boolean;
}
