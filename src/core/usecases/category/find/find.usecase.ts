import { CategoryRepository } from "@core/domain/category/repository/category.repository";
import { InputFindCategoryUseCase, OutputFindCategoryUseCase } from "./find.category.dto";

export default class FindCategoryUseCase {
     constructor(private readonly categoryRepository: CategoryRepository) { 
        this.categoryRepository = categoryRepository;
     }

     async execute(input: InputFindCategoryUseCase): Promise<OutputFindCategoryUseCase> {
        const category = await this.categoryRepository.find(input);
        if(!category) {
            throw new Error('Category not found');
        }
        return category;
    }
}