import EntityError from '@core/domain/@shared/error/entity.error';
import { InputDeleteItemDto, OutputDeleteItemDto } from './delete.item.dto';

export default class DeleteItemUseCase {
   constructor(private itemRepository: any) {
      this.itemRepository = itemRepository;
   }

   async execute(input: InputDeleteItemDto): Promise<OutputDeleteItemDto> {
      const item = await this.itemRepository.find(input);
      if (!item) throw new EntityError('Item not found');
      await this.itemRepository.delete(input);
   }
}
