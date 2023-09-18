export interface InputUpdateCategoryDto { 
    id: string;
    name: string;
    description?: string;
}

export interface OutputUpdateCategoryDto {
    name: string;
    description?: string;
 }