export interface InputListBillDto {
   userId: string;
}

export interface OutputListBillDto {
   total: number;
   bills: {
      id: string;
      name: string;
      description?: string;
      total: number;
      vendorId: string;
      vendorName: string;
      date: Date;
      createdAt: Date;
      updatedAt: Date;
      items: {
         quantity: number;
         price: number;
         categoryId: string;
         categoryName: string;
         itemId: string;
         name: string;
         description?: string;
      }[];
   }[];
   meta: {
      total: number;
      hasNext: boolean;
      page: number;
      perPage: number;
   };
}
