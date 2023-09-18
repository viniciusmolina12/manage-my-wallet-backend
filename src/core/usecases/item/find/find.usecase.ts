import { ItemRepository } from "@core/domain/item/repository/item.repository";
import { InputFindItemDto, OutputFindItemDto } from "./find.item.dto";

export default class FindItemUseCase {
    constructor(private itemRepository: ItemRepository) {
        this.itemRepository = itemRepository;
    }

    async execute(input: InputFindItemDto): Promise<OutputFindItemDto> {
        const item = await this.itemRepository.find(input.id);
        if(!item) throw new Error('Item not found');
        return {
            id: item.id,
            name: item.name,
            categoryId: item.categoryId,
            description: item.description
        }
    }
}