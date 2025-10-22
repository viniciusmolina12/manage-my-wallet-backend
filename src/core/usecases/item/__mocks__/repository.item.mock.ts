const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findByUser: jest.fn(),
   findAllByUserId: jest.fn(),
   findAllByUser: jest.fn(),
   deleteByUser: jest.fn(),
   findByName: jest.fn(),
   findItemsByIds: jest.fn(),
};

export default mockRepository;
