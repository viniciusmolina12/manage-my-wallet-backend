import { UserRepository } from "@core/domain/user/repository/user.repository";
import { InputUpdateUserDto, OutputUpdateUserDto } from "./update.user.dto";
import EntityError from "@core/domain/@shared/error/entity.error";

export default class UpdateUserUseCase { 
    constructor(private readonly userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(input: InputUpdateUserDto): Promise<OutputUpdateUserDto> {
        const user = await this.userRepository.find(input.id);
        if (!user) throw new EntityError('User not found');
        
        const hasUserWithNewEmail = await this.userRepository.search({ email: input.email });
        if(hasUserWithNewEmail?.length > 0 && user.email !== input.email) throw new EntityError('Email already exists');

        user.changeName(input.name);
        user.changeEmail(input.email)
        await this.userRepository.update(user);
        return {
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: new Date()
        }
    }
    
}