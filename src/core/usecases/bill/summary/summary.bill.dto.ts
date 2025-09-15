import { PeriodType } from './periods';

export interface InputSummaryBillDto {
   userId: string;
   period: PeriodType;
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
         itemId: string;
         price: number;
         quantity: number;
      }[];
   }[];
}
