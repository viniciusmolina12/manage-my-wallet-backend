import EntityError from "@core/domain/@shared/error/entity.error";
import User from "./user.entity";

describe('User entity tests', () => {
    it('should throw if id is empty', () => {
        expect(() => {
            const sut = new User('', 'any_name', 'any_email', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Id is required, ')); 
    })

    it('should throw if name is empty', () => {
        expect(() => {
            const sut = new User('any_id', '', 'any_email', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Name is required, ')); 
    })

    it('should throw if email is empty', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', '', 'any_username', 'any_password');
        }).toThrowError(new EntityError('user: Email is required, ')); 
    })

    it('should throw if username is empty', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', 'any_email', '', 'any_password');
        }).toThrowError(new EntityError('user: Username is required, ')); 
    })

    it('should throw if password is empty', () => {
        expect(() => {
            const sut = new User('any_id', 'any_name', 'any_email', 'any_username', '');
        }).toThrowError(new EntityError('user: Password is required, ')); 
    })
})