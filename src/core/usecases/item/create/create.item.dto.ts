export interface InputCreateItemDto {
   name: string;
   description?: string;
   userId: string;
   categoryId: string;
}

export interface OutputCreateItemDto {
   id: string;
   name: string;
   description?: string;
   categoryId: string;
   createdAt: Date;
   updatedAt: Date;
}
