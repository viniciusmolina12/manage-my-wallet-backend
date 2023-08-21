import Item from "../../../domain/item/entity/item.entity";
import { ItemRepository } from "../../../domain/item/repository/item.repository";
import { InputCreateItemDto, OutputCreateItemDto } from "./create.item.dto";
import { v4 as uuid } from 'uuid';
export class CreateItemUseCase {
    private readonly itemRepository: ItemRepository;
    constructor(itemRepository: ItemRepository) {
        this.itemRepository = itemRepository;
    }

    async execute(input: InputCreateItemDto): Promise<OutputCreateItemDto> {
        const item = new Item(uuid(), input.name, input.categoryId, input.description);
        await this.itemRepository.create(item);
        return {
            id: item.id,
            categoryId: item.categoryId,
            name: item.name,
            description: item.description
        }
    }
}