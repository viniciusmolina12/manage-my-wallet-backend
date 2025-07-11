export interface InputUpdateUserDto {
   id: string;
   name: string;
   email: string;
}

export interface OutputUpdateUserDto {
   name: string;
   email: string;
   updatedAt: Date;
}
