export interface InputUpdateBillDto {
   id: string;
   name: string;
   userId: string;
   description?: string;
   vendorId: string;
   date: Date;
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
   date: Date;
   total: number;
   createdAt: Date;
   updatedAt: Date;
   items: {
      id: string;
      itemId: string;
      price: number;
      quantity: number;
   }[];
}
