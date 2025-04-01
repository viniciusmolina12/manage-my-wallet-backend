export interface InputLoginUserDto {
   email: string;
   password: string;
}
export interface OutputLoginUserDto {
   token: string;
   user: {
      id: string;
      name: string;
      email: string;
   };
}
