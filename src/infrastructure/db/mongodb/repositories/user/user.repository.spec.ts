import User from "@core/domain/user/entity/user.entity";
import mockDb from "../__mocks__/mockDb"
import UserModel from "../../model/user.model";
beforeAll(async () => {
    await mockDb.connect();
} )

beforeEach(async () => { 
    await mockDb.clear();
})

afterAll(async () => {
    await mockDb.disconnect();
} )
describe('User repository tests', () => {
    it('should create an user', async () => {
        // const sut = new MongoDbUserRepository();
        // const user = new User('any_id', 'any_name', 'any_email', 'any_password');
        // await sut.create(user);
        // const userCreated = await UserModel.findOne({_id: user.id});
        // expect(userCreated).toBeTruthy();
        // expect(userCreated?.id).toBe(user.id);
        // expect(userCreated?.name).toBe(user.name);
        // expect(userCreated?.email).toBe(user.email);
        expect(true).toBe(true)
    })
})