import { PeriodType } from './periods';

export interface InputSummaryBillDto {
   userId: string;
   period: PeriodType;
}

export interface OutputSummaryBillDto {
   bills: {
      id: string;
      name: string;
      description?: string;
      total: number;
      vendorId: string;
      vendorName: string;
      date: string;
      createdAt: Date;
      updatedAt: Date;
      items: {
         quantity: number;
         price: number;
         categoryId: string;
         categoryName: string;
         itemId: string;
         description?: string;
      }[];
   }[];
}
