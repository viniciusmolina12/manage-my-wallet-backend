export interface InputUpdateCategoryDto {
   id: string;
   userId: string;
   name: string;
   description?: string;
}

export interface OutputUpdateCategoryDto {
   id: string;
   name: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}
