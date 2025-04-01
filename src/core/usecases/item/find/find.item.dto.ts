export interface InputFindItemDto {
   id: string;
}

export interface OutputFindItemDto {
   id: string;
   name: string;
   categoryId: string;
   description?: string;
}
