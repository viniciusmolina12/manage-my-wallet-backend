import { ItemRepository } from '@core/domain/item/repository/item.repository';
import { OutputListItemDto } from './list.item.dto';

export type InputListItemDto = {
   userId: string;
};

export default class ListItemUsecase {
   constructor(private itemRepository: ItemRepository) {
      this.itemRepository = itemRepository;
   }

   async execute(input: InputListItemDto): Promise<OutputListItemDto> {
      const items = await this.itemRepository.findAllByUserId(input.userId);
      const output = items?.map((item: any) => ({
         id: item.id,
         name: item.name,
         categoryId: item.categoryId,
         description: item.description,
         createdAt: item.createdAt,
         updatedAt: item.updatedAt,
      }));
      return { items: output };
   }
}
