export interface InputResetPasswordUserDto {
    token: string;      
    password: string;
}

export type OutputResetPasswordUserDto = void;