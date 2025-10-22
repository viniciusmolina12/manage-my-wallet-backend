import {
   ItemRepository,
   SearchItem,
} from '@core/domain/item/repository/item.repository';
import { OutputListItemDto } from './list.item.dto';
import { Filter } from '@core/domain/@shared/filter/filter';

export type InputListItemDto = {
   userId: string;
};

export default class ListItemUsecase {
   constructor(private itemRepository: ItemRepository) {
      this.itemRepository = itemRepository;
   }

   async execute(
      input: InputListItemDto,
      filter: Filter<SearchItem>
   ): Promise<OutputListItemDto> {
      const { data, ...meta } = await this.itemRepository.findAllByUser(
         input.userId,
         filter
      );
      const output = data.map((item: any) => ({
         id: item.id,
         name: item.name,
         categoryId: item.categoryId,
         description: item.description,
         createdAt: item.createdAt,
         updatedAt: item.updatedAt,
      }));
      return { items: output, meta };
   }
}
