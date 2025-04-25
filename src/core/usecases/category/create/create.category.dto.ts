export interface InputCreateCategoryDto {
   name: string;
   description?: string;
   userId: string;
}

export interface OutputCreateCategoryDto {
   id: string;
   name: string;
   description?: string;
}
