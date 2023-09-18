export interface InputUpdateItemDto {
    id: string;
    name: string;
    categoryId: string;
    description?: string;
}

export interface OutputUpdateItemDto {
    name: string;
    categoryId: string;
    description?: string;
}