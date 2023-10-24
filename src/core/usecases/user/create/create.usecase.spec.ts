import Encrypt from "@core/domain/interfaces/encrypt.interface";
import CreateUserUseCase from "./create.usecase";
import JwtGenerator from "@core/domain/interfaces/jwtGenerator.interface";
import User from "@core/domain/user/entity/user.entity";

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(async (): Promise<Array<any>> => []),
}

class EncryptStub implements Encrypt {
    encrypt(password: string): string {
        return 'encrypted_password'
    }
}

class JwtGeneratorStub implements JwtGenerator {
    generateJWT(id: string): Promise<string> {
        return Promise.resolve('any_token');
    }
}

interface SutTypes {
    encryptStub: Encrypt;
    jwtGeneratorStub: JwtGenerator;
    sut: CreateUserUseCase;
}
const makeSut = (): SutTypes => {
    const encryptStub = new EncryptStub();
    const jwtGeneratorStub = new JwtGeneratorStub();
    const sut = new CreateUserUseCase(mockRepository, encryptStub, jwtGeneratorStub);
    return {
        sut,
        encryptStub,
        jwtGeneratorStub
    }
}

const input = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
}

describe('Create user usecase tests', () => {
    it('should create an user', async () => {  
        const { sut }  = makeSut();
        const user = await sut.execute(input);
        expect(user).toBeTruthy();
        expect(user.email).toBe('any_email@mail.com');
        expect(user.name).toBe('any_name');
        expect(user.token).toBe('any_token')
        expect(user.createdAt).toBeTruthy();
        expect(user.updatedAt).toBeTruthy();
    })

    it('should create user with encrypted password', async () => {  
        const { sut }  = makeSut();
        const spy = jest.spyOn(mockRepository, 'create');
        const user = await sut.execute(input);
        const userCompare = new User(user.id, user.name, user.email, 'encrypted_password');
        expect(spy).toHaveBeenCalledWith(userCompare)
    })

    it('should throw if user exists', async () => {  
        const { sut }  = makeSut();
        mockRepository.search.mockReturnValueOnce(Promise.resolve([{id: 'any_id', name: 'any_name', email: 'any_email@mail.com', userName: 'any_username', password: 'encrypted_password'}]))
        await expect(sut.execute(input)).rejects.toThrow('User already exists');
    })
})