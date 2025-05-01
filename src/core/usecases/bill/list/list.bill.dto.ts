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
      items: {
         id: string;
         itemId: string;
         price: number;
         quantity: number;
      }[];
   }[];
}
