const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findVendorByName: jest.fn(),
   findByUser: jest.fn(),
   findVendorsByIds: jest.fn(),
   findAllByUser: jest.fn(),
   deleteByUser: jest.fn(),
};

export default mockRepository;
