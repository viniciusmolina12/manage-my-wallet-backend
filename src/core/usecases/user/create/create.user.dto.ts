export interface InputCreateUserDto {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}

export interface OutputCreateUserDto {
   id: string;
   name: string;
   email: string;
   token: string;
   createdAt: Date;
   updatedAt: Date;
}
