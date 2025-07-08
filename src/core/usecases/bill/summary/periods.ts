import EntityError from '@core/domain/@shared/error/entity.error';

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

   constructor(date: Date) {
      this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
   }
}

export class YearPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(date: Date) {
      this.startDate = new Date(date.getFullYear(), 0, 1);
      this.endDate = new Date(date.getFullYear(), 11, 31);
   }
}

export class SemesterPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(date: Date) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      this.startDate = new Date(sixMonthsAgo);
      this.endDate = date;
   }
}

export class QuarterPeriod implements Period {
   startDate: Date;
   endDate: Date;

   constructor(date: Date) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      this.startDate = new Date(threeMonthsAgo);
      this.endDate = date;
   }
}

export class PeriodFactory {
   static create(period: PeriodType, date: Date): Period {
      switch (period) {
         case PeriodType.MONTH:
            return new MonthPeriod(date);
         case PeriodType.YEAR:
            return new YearPeriod(date);
         case PeriodType.SEMESTER:
            return new SemesterPeriod(date);
         case PeriodType.QUARTER:
            return new QuarterPeriod(date);
         default:
            throw new EntityError('Invalid period');
      }
   }
}
