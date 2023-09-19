export interface InputListCategoryUseCase { }

export interface OutputListCategoryUseCase {
    categories: 
        {
            id: string;
            name: string;
            description?: string;
        }[]
    
}