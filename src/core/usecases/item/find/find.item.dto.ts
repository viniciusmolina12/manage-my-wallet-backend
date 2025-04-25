export interface InputFindItemDto {
   id: string;
   userId: string;
}

export interface OutputFindItemDto {
   id: string;
   name: string;
   categoryId: string;
   description?: string;
}
