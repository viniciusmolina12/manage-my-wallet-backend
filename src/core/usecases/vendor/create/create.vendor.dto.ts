export interface InputCreateVendorDto {
   name: string;
   userId: string;
}

export interface OutputCreateVendorDto {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}
