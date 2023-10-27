import Encrypt from "@core/domain/interfaces/encrypt.interface";
import { UserRepository } from "@core/domain/user/repository/user.repository";
import { InputResetPasswordUserDto, OutputResetPasswordUserDto } from "./reset_password.user.dto";
import EntityError from "@core/domain/@shared/error/entity.error";
import CONSTANTS from "@config/constants";

export default class ResetPasswordUserUseCase { 
    constructor(private readonly userRepository: UserRepository, private readonly encrypt: Encrypt) {
        this.userRepository = userRepository;
        this.encrypt = encrypt;
    }

    async execute(input: InputResetPasswordUserDto): Promise<OutputResetPasswordUserDto> {
        const user = await this.userRepository.findUserByResetPasswordToken(input.token);
        if (!user) {
            throw new EntityError("User not found");
        }
        const now = new Date();
        if(now > user.expiresIn) {
            throw new EntityError('Token expired');
        }
        if(user.resetPasswordToken !== input.token) {
            throw new EntityError('Token invalid');
        }
        const encryptPassword = this.encrypt.encrypt(input.password, CONSTANTS.SALTS_ROUND); 
        user.changePassword(encryptPassword);
        await this.userRepository.update(user);
    }
}