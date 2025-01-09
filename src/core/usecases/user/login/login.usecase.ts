import { UserRepository } from "@core/domain/user/repository/user.repository";
import { InputLoginUserDto, OutputLoginUserDto } from "./login.user.dto";
import Encrypt from "@core/domain/interfaces/encrypt.interface";
import JwtGenerator from "@core/domain/interfaces/jwtGenerator.interface";
import CONSTANTS from "@config/constants";
import EntityError from "@core/domain/@shared/error/entity.error";
import ENV from "@config/env";

export default class LoginUserUseCase {
    constructor(private readonly userRepository: UserRepository, private readonly encrypt: Encrypt, private readonly jwtGenerator: JwtGenerator) {
        this.userRepository = userRepository;
        this.encrypt = encrypt;
        this.jwtGenerator = jwtGenerator;
    }
    async execute(input: InputLoginUserDto): Promise<OutputLoginUserDto> {
        const userExists = await this.userRepository.search( { email: input.email });
        if (!userExists?.length) throw new EntityError('Email or password is invalid');
        const user = userExists[0];
        const encryptPassword = this.encrypt.encrypt(input.password, CONSTANTS.SALTS_ROUND);
        if(encryptPassword !== user.password) throw new EntityError('Email or password is invalid');
        const expiresIn = new Date(new Date().setDate(new Date().getHours() + 1));
        const token = this.jwtGenerator.generateJwt({ id: user.id, email: user.email, name: user.name }, ENV.SECRET_KEY, expiresIn);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token
        }
    }
}