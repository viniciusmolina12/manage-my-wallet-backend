import { ItemRepository } from "@core/domain/item/repository/item.repository";
import { OutputListItemDto } from "./list.item.dto";

export default class ListItemUsecase { 
    constructor(
        private itemRepository: ItemRepository
    ) {
        this.itemRepository = itemRepository;
     }
    
    async execute(): Promise<OutputListItemDto> {
        const items = await this.itemRepository.findAll();
        const output = items?.map((item: any) => ({
            id: item.id,
            name: item.name,
            categoryId: item.categoryId,
            description: item.description
        }));
        return { items: output }
    }
}
    