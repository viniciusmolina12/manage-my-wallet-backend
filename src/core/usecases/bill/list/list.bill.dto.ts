export interface InputListBillDto {}

export interface OutputListBillDto {
   bills: {
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
   }[];
}
