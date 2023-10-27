export default  {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(async (): Promise<Array<any>> => []),
    getRecoveryPasswordToken: jest.fn(),
    getRecoveryData: jest.fn(),
    createRecoveryData: jest.fn(),
    findUserByResetPasswordToken: jest.fn(),
    updateResetPasswordToken: jest.fn()
}