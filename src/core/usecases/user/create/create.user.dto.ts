export interface InputCreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface OutputCreateUserDto {
    id: string;
    name: string;
    email: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}