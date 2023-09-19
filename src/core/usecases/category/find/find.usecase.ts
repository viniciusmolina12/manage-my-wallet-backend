import { CategoryRepository } from "@core/domain/category/repository/category.repository";
import { InputFindCategoryDto, OutputFindCategoryDto } from "./find.category.dto";

export default class FindCategoryUseCase {
     constructor(private readonly categoryRepository: CategoryRepository) { 
        this.categoryRepository = categoryRepository;
     }

     async execute(input: InputFindCategoryDto): Promise<OutputFindCategoryDto> {
        const category = await this.categoryRepository.find(input);
        if(!category) {
            throw new Error('Category not found');
        }
        return {
            id: category.id,
            name: category.name,
            description: category?.description,
        };
    }
}