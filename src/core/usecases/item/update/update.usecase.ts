import EntityError from '@core/domain/@shared/error/entity.error';
import Item, { ItemId } from '@core/domain/item/entity/item.entity';
import { ItemRepository } from '@core/domain/item/repository/item.repository';
import { InputUpdateItemDto, OutputUpdateItemDto } from './update.item.dto';
import { CategoryId } from '@core/domain/category/entity/category.entity';
import { UserId } from '@core/domain/user/entity/user.entity';

export default class UpdateItemUseCase {
   constructor(private itemRepository: ItemRepository) {
      this.itemRepository = itemRepository;
   }

   async execute(input: InputUpdateItemDto): Promise<OutputUpdateItemDto> {
      const item = await this.itemRepository.findByUser(input.id, input.userId);
      if (!item) throw new EntityError('Item not found');
      const updatedItem = new Item(
         new ItemId(input.id),
         input.name,
         new CategoryId(input.categoryId),
         new UserId(input.userId),
         input.description
      );
      await this.itemRepository.update(updatedItem);
      return {
         categoryId: updatedItem.categoryId,
         description: updatedItem?.description,
         name: updatedItem.name,
         createdAt: item.createdAt,
         updatedAt: updatedItem.updatedAt,
      };
   }
}
