export enum PeriodType {
   MONTH = 'month',
   YEAR = 'year',
   SEMESTER = 'semester',
   QUARTER = 'quarter',
}

export interface Period {
   startDate: Date;
   endDate: Date;
}

export class MonthPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(year: number, month: number) {
      this.startDate = new Date(year, month, 1);
      this.endDate = new Date(year, month + 1, 0);
   }
}

export class YearPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(year: number) {
      this.startDate = new Date(year, 0, 1);
      this.endDate = new Date(year, 11, 31);
   }
}

export class SemesterPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(year: number) {
      this.startDate = new Date(year, 0, 1);
      this.endDate = new Date(year, 5, 30);
   }
}

export class QuarterPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(year: number) {
      this.startDate = new Date(year, 0, 1);
      this.endDate = new Date(year, 3, 30);
   }
}

export class PeriodFactory {
   static create(period: PeriodType, year: number, month: number): Period {
      switch (period) {
         case PeriodType.MONTH:
            return new MonthPeriod(year, month);
         case PeriodType.YEAR:
            return new YearPeriod(year);
         case PeriodType.SEMESTER:
            return new SemesterPeriod(year);
         case PeriodType.QUARTER:
            return new QuarterPeriod(year);
         default:
            throw new Error('Invalid period');
      }
   }
}
