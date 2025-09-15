import Item, { ItemId } from '@core/domain/item/entity/item.entity';
import { ItemRepository } from '@core/domain/item/repository/item.repository';
import { InputCreateItemDto, OutputCreateItemDto } from './create.item.dto';
import { CategoryId } from '@core/domain/category/entity/category.entity';
import { UserId } from '@core/domain/user/entity/user.entity';
import EntityError from '@core/domain/@shared/error/entity.error';
export default class CreateItemUseCase {
   private readonly itemRepository: ItemRepository;
   constructor(itemRepository: ItemRepository) {
      this.itemRepository = itemRepository;
   }

   async execute(input: InputCreateItemDto): Promise<OutputCreateItemDto> {
      const item = new Item(
         new ItemId(),
         input.name,
         new CategoryId(input.categoryId),
         new UserId(input.userId),
         input.description
      );
      const itemExists = await this.itemRepository.findByName(
         item.name,
         item.userId.id
      );
      if (itemExists) throw new EntityError('Item already exists');
      await this.itemRepository.create(item);
      return {
         id: item.id,
         categoryId: item.categoryId,
         name: item.name,
         description: item.description,
         createdAt: item.createdAt,
         updatedAt: item.updatedAt,
      };
   }
}
