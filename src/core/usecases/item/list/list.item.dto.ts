export interface OutputListItemDto {
   items: {
      id: string;
      name: string;
      categoryId: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
}
