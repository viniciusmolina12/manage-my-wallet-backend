export interface OutputListCategoryDto {
   categories: {
      id: string;
      name: string;
      description?: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}
