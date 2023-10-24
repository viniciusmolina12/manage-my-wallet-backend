import EntityError from "@core/domain/@shared/error/entity.error";
import User from "./user.entity";

describe('User entity tests', () => {
    it('should throw if id is empty', () => {
        expect(() => {
            const sut = new User('', 'any_name', 'any_email@mail.com', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Id is required, ')); 
    })

    it('should throw if name is empty', () => {
        expect(() => {
            const sut = new User('any_id', '', 'any_email@mail.com', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Name is required, ')); 
    })

    it('should throw if email is empty', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', '', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Email is required, user: Email is invalid, ')); 
    })

    it('should throw if email is invalid', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', 'any_email_invalid.invalid', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Email is invalid, ')); 
    })

    it('should throw if username is empty', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', 'any_email@mail.com', '', 'any_password');
        }).toThrowError(new EntityError('user: Username is required, ')); 
    })

    it('should throw if password is empty', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', 'any_email@mail.com', 'any_username', '');
        }).toThrowError(new EntityError('user: Password is required, ')); 
    })

    it('should change name', () => {
        const sut = new User('any_id', 'any_name', 'any_email@mail.com', 'any_username', 'any_password');
        sut.changeName('new_name');
        expect(sut.name).toBe('new_name');
    })

    it('should change userName', () => {
        const sut = new User('any_id', 'any_name', 'any_email@mail.com', 'any_username', 'any_password');
        sut.changeUsername('new_username');
        expect(sut.userName).toBe('new_username');
    })

    it('should change email', () => {
        const sut = new User('any_id', 'any_name', 'any_email@mail.com', 'any_username', 'any_password');
        sut.changeEmail('new_mail@mail.com');
        expect(sut.email).toBe('new_mail@mail.com');
    })

    it('should change password', () => {
        const sut = new User('any_id', 'any_name', 'any_email@mail.com', 'any_username', 'any_password');
        sut.changePassword('new_password');
        expect(sut.password).toBe('new_password');
    })
})