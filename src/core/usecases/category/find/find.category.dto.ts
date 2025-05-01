export type InputFindCategoryDto = {
   id: string;
   userId: string;
};
export interface OutputFindCategoryDto {
   id: string;
   name: string;
   description?: string;
   createdAt: Date;
   updatedAt: Date;
}
