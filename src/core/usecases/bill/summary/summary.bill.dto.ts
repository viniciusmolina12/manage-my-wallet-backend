export interface InputSummaryBillDto {
   userId: string;
   period: 'month' | 'year' | 'semester' | 'quarter';
}

export interface OutputSummaryBillDto {
   bills: {
      id: string;
      description?: string;
      name: string;
      vendorId: string;
      total: number;
      createdAt: Date;
      updatedAt: Date;
      date: Date;
      items: {
         id: string;
         itemId: string;
         price: number;
         quantity: number;
      }[];
   }[];
}
