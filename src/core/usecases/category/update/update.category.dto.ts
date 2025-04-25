export interface InputUpdateCategoryDto {
   id: string;
   userId: string;
   name: string;
   description?: string;
}

export interface OutputUpdateCategoryDto {
   name: string;
   description?: string;
}
