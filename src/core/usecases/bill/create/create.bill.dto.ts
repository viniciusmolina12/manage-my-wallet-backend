export interface InputCreateBillDto {
   name: string;
   userId: string;
   description?: string;
   vendorId: string;
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
   createdDate: Date;
   total: number;
   items: {
      id: string;
      itemId: string;
      price: number;
      quantity: number;
   }[];
}
