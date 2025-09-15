export interface InputListBillDto {
   userId: string;
}

export interface OutputListBillDto {
   bills: {
      id: string;
      description?: string;
      name: string;
      vendorId: string;
      total: number;
      createdAt: Date;
      updatedAt: Date;
      date: Date;
      items: {
         itemId: string;
         price: number;
         quantity: number;
      }[];
   }[];
   meta: {
      total: number;
      hasNext: boolean;
      page: number;
      perPage: number;
   };
}
