export interface InputFindVendorDto {
   id: string;
   userId: string;
}

export interface OutputFindVendorDto {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
}
