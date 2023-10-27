import { UserRepository } from "@core/domain/user/repository/user.repository";
import { InputRecoverPasswordUserDto, OutputRecoverPasswordUserDto } from "./recover_password.user.dto";
import EntityError from "@core/domain/@shared/error/entity.error";
import Encrypt from "@core/domain/interfaces/encrypt.interface";
import Mailer from "@core/domain/interfaces/mailer.interface";
import ENV from "@config/env";

export default class RecoverPasswordUserUseCase {
    constructor(private readonly userRepository: UserRepository, private readonly mailer: Mailer, private readonly encrypt: Encrypt) {
        this.userRepository = userRepository;
        this.mailer = mailer;
        this.encrypt = encrypt;
    }

    async execute(input: InputRecoverPasswordUserDto): Promise<OutputRecoverPasswordUserDto> {
        const users = await this.userRepository.search({ email: input.email });
        if (!users.length) {
            throw new EntityError("User not found");
        }
        const user = users[0];
        const expiresIn = new Date(new Date().setDate(new Date().getHours() + 1));
        const token = this.encrypt.generatePasswordRecoverToken(expiresIn);
        await this.userRepository.createRecoveryData(user.email, token, expiresIn);
        await this.mailer.sendMail({
            to: user.email,
            from: ENV.FROM_EMAIL,
            subject: "Password recovery",
            content: `<p>Hello ${user.name},</p><p><a href="${ENV.RESET_PASSWORD_URL}?token=${token}">Click here to reset your password</a></p>`,
        });
        await this.userRepository.updateResetPasswordToken(user, token, expiresIn);
        const censoredEmail = user.email.replace(/^(.)(.*)(?=@)/, (match, firstChar, hiddenPart) => firstChar + '*'.repeat(hiddenPart.length));
        return { censoredEmail };
    }
}