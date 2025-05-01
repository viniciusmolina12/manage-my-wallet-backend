export interface InputUpdateBillDto {
   id: string;
   name: string;
   userId: string;
   description?: string;
   vendorId: string;
   items: {
      id?: string;
      itemId: string;
      price: number;
      quantity: number;
   }[];
}

export interface OutputUpdateBillDto {
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
}
