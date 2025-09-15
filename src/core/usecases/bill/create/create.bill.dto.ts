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
}
