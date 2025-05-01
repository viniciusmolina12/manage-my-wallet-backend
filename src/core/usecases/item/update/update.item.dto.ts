export interface InputUpdateItemDto {
   id: string;
   userId: string;
   name: string;
   categoryId: string;
   description?: string;
}

export interface OutputUpdateItemDto {
   name: string;
   categoryId: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}
