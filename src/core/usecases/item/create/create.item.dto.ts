export interface InputCreateItemDto {
    name: string
    description?: string
    categoryId: string
}

export interface OutputCreateItemDto {
    id: string
    name: string
    description?: string
    categoryId: string
}