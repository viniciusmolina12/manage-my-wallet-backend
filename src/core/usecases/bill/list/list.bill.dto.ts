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
      items: {
         id: string;
         itemId: string;
         price: number;
         quantity: number;
      }[];
   }[];
}
