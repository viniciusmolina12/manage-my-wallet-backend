export interface InputFindBillDto {
   id: string;
}

export interface OutputFindBillDto {
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
