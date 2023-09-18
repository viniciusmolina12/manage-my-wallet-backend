import EntityError from "../../../domain/@shared/error/entity.error";
import Item from "../../../domain/item/entity/item.entity";
import { ItemRepository } from "../../../domain/item/repository/item.repository";
import { InputUpdateItemDto, OutputUpdateItemDto } from "./update.item.dto";

export default class UpdateItemUseCase {

    constructor(private itemRepository: ItemRepository) { 
        this.itemRepository = itemRepository;
    }

    async execute(input: InputUpdateItemDto): Promise<OutputUpdateItemDto> {
        const item = await this.itemRepository.find(input.id)
        if(!item) throw new EntityError('Item not found');
        const updatedItem = new Item(input.id, input.name, input.categoryId, input.description);
        await this.itemRepository.update(updatedItem)
        return {
            categoryId: updatedItem.categoryId,
            description: updatedItem?.description,
            name: updatedItem.name
        };
    }
}