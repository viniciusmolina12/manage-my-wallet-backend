import { CategoryRepository } from "@core/domain/category/repository/category.repository";
import { InputListCategoryUseCase, OutputListCategoryUseCase } from "./list.category.dto";

export default class ListCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async execute(): Promise<OutputListCategoryUseCase> {
        const categories = await this.categoryRepository.findAll();
        return { categories };
    }
}
