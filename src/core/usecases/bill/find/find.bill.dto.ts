export interface InputFindBillDto {
   id: string;
   userId: string;
}

export interface OutputFindBillDto {
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
