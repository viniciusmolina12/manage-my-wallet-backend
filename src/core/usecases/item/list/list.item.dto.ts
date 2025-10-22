import { Pagination } from '@core/domain/@shared/filter/filter';

export interface OutputListItemDto {
   items: {
      id: string;
      name: string;
      categoryId: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
   meta: Omit<Pagination<any>, 'data'>;
}
