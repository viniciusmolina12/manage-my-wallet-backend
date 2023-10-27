import { RepositoryInterface } from "../../@shared/repository.interface";
import User from "../entity/user.entity";

export interface UserRepository extends RepositoryInterface<User> {
    search(filter: { name?: string, email?: string, userName?: string }): Promise<User[]>
    getRecoveryData(email: string): Promise<{ token: string, expiresIn: Date }>
    createRecoveryData(email: string, token: string, expiresIn: Date): Promise<void>;
    findUserByResetPasswordToken(resetPasswordToken: string): Promise<User & { resetPasswordToken: string, expiresIn: Date }>
    updateResetPasswordToken(user: User, resetPasswordToken: string, expiresIn: Date): Promise<void>
}