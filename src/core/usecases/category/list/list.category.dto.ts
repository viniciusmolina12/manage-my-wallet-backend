export interface OutputListCategoryDto {
   meta: {
      total: number;
      hasNext: boolean;
      page: number;
      perPage: number;
   };
   categories: {
      id: string;
      name: string;
      description?: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}
