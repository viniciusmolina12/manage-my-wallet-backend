export interface InputCreateBillDto {
   name: string;
   userId: string;
   description?: string;
   vendorId: string;
   date: Date;
   items: {
      itemId: string;
      price: number;
      quantity: number;
   }[];
}

export interface OutputCreateBillDto {
   id: string;
   userId: string;
   description?: string;
   vendorId: string;
   name: string;
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
