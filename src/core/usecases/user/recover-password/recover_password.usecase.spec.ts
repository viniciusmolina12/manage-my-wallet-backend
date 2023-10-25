import User from "@core/domain/user/entity/user.entity"
import mockRepository from "../__mocks__/repository.mock"
import { EncryptStub, MailerStub } from "../__mocks__/stubs.mock"
import RecoverPasswordUserUseCase from "./recover_password.usecase"
import EntityError from "@core/domain/@shared/error/entity.error"


interface SutTypes { 
    mailerStub: MailerStub,
    encryptStub: EncryptStub,
    sut: RecoverPasswordUserUseCase
}
const makeSut = () => {
    const mailerStub = new MailerStub();
    const encryptStub = new EncryptStub();
    const sut = new RecoverPasswordUserUseCase(mockRepository, mailerStub, encryptStub);
    return { 
        sut, mailerStub, encryptStub
    }
}
describe('Recover user password usecase tests', () => {
    it('should be able to recover user password', async () => {
        const { sut } = makeSut();
        mockRepository.search.mockReturnValueOnce(Promise.resolve([new User('any_id', 'any_name', 'any_email@mail.com', 'any_password')]));
        const result = await sut.execute({ email: 'any_email@mail.com' });
        expect(result).toEqual({ censoredEmail: 'a********@mail.com' }); 
    })

    it('should throw if user not found', async () => {
        const { sut } = makeSut();
        await expect(sut.execute({ email: 'any_email@mail.com' })).rejects.toThrow(new EntityError('User not found'))
    })

    it('should call generatePasswordRecoverToken method with correct values', async () => {
        const { sut, encryptStub } = makeSut();
        mockRepository.search.mockReturnValueOnce(Promise.resolve([new User('any_id', 'any_name', 'any_email@mail.com', 'any_password')]));
        const generatePasswordRecoverTokenSpy = jest.spyOn(encryptStub, 'generatePasswordRecoverToken');
        await sut.execute({ email: 'any_email@mail.com' });
        expect(generatePasswordRecoverTokenSpy).toHaveBeenCalledWith(expect.any(Date));
    })

    it('should call createRecoveryData method with correct values', async () => {
        const { sut } = makeSut();
        mockRepository.search.mockReturnValueOnce(Promise.resolve([new User('any_id', 'any_name', 'any_email@mail.com', 'any_password')]));
        const createRecoveryDataSpy = jest.spyOn(mockRepository, 'createRecoveryData');
        await sut.execute({ email: 'any_email@mail.com' });
        expect(createRecoveryDataSpy).toHaveBeenCalledWith('any_email@mail.com', 'token', expect.any(Date));
    })
    
})