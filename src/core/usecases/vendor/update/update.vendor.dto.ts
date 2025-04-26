export interface InputUpdateVendorDto {
   id: string;
   name: string;
   userId: string;
}

export interface OutputUpdateVendorDto {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}
