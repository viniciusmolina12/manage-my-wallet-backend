export interface InputFindBillDto {
   id: string;
   userId: string;
}

export interface OutputFindBillDto {
   id: string;
   description?: string;
   name: string;
   vendorId: string;
   vendorName: string;
   total: number;
   createdAt: Date;
   updatedAt: Date;
   date: Date;
   items: {
      id: string;
      name: string;
      description?: string;
      price: number;
      quantity: number;
      categoryId: string;
      categoryName: string;
   }[];
}
