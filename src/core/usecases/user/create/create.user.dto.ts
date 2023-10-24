export interface InputCreateUserDto {
    name: string;
    email: string;
    password: string;
    userName: string;
}

export interface OutputCreateUserDto {
    id: string;
    name: string;
    email: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}