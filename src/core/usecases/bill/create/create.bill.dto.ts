export interface InputCreateBillDto {
   name: string;
   description?: string;
   items: {
      itemId: string;
      price: number;
      quantity: number;
   }[];
}

export interface OutputCreateBillDto {
   id: string;
   description?: string;
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
