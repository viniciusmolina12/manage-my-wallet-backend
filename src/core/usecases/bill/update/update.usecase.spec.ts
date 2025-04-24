import EntityError from '@core/domain/@shared/error/entity.error';
import { InputUpdateBillDto } from './update.bill.dto';
import UpdateBillUseCase from './update.usecase';

const mockRepository = {
   create: jest.fn(),
   update: jest.fn(),
   find: jest.fn(),
   findAll: jest.fn(),
   delete: jest.fn(),
   findByUser: jest.fn(),
   findAllByUser: jest.fn(),
   deleteByUser: jest.fn(),
};
const input = {
   id: 'any_id',
   name: 'any_name_2',
   userId: 'any_user_id',
   description: 'any_other_description',
   items: [
      {
         id: 'any_other_id',
         itemId: 'any_other_item_id',
         price: 10,
         quantity: 2,
      },
      {
         id: 'any_other_id_2',
         itemId: 'any_other_item_id_2',
         price: 12,
         quantity: 3,
      },
   ],
};
describe('Update bill usecase', () => {
   it('should update a bill', async () => {
      mockRepository.findByUser.mockReturnValueOnce({
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
         items: [
            {
               id: 'any_id',
               itemId: 'any_item_id',
               price: 5,
               quantity: 2,
            },
         ],
      });
      const sut = new UpdateBillUseCase(mockRepository);
      const bill = await sut.execute(input);
      expect(bill.id).toBe('any_id');
      expect(bill.name).toBe('any_name_2');
      expect(bill.description).toBe('any_other_description');
      expect(bill.total).toBe(56);
      expect(bill.items.length).toBe(2);
      expect(bill.items[0].itemId).toBe('any_other_item_id');
      expect(bill.items[0].price).toBe(10);
      expect(bill.items[0].quantity).toBe(2);
      expect(bill.items[1].itemId).toBe('any_other_item_id_2');
      expect(bill.items[1].price).toBe(12);
      expect(bill.items[1].quantity).toBe(3);
   });

   it('should throw an error if name is empty', async () => {
      mockRepository.findByUser.mockReturnValueOnce({
         id: 'any_id',
         name: 'any_name',
         description: 'any_description',
         items: [
            {
               id: 'any_id',
               itemId: 'any_item_id',
               price: 5,
               quantity: 2,
            },
         ],
      });
      const input: InputUpdateBillDto = {
         id: 'any_id',
         name: '',
         userId: 'any_user_id',
         description: 'any_other_description',
         items: [
            {
               id: 'any_other_id',
               itemId: 'any_other_item_id',
               price: 10,
               quantity: 2,
            },
            {
               id: 'any_other_id_2',
               itemId: 'any_other_item_id_2',
               price: 12,
               quantity: 3,
            },
         ],
      };
      const sut = new UpdateBillUseCase(mockRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new EntityError('bill: Name is required, ')
      );
   });

   it('should throw an error if bill does not exist', async () => {
      const input: InputUpdateBillDto = {
         id: 'any_id',
         name: '',
         userId: 'any_user_id',
         description: 'any_other_description',
         items: [
            {
               id: 'any_other_id',
               itemId: 'any_other_item_id',
               price: 10,
               quantity: 2,
            },
            {
               id: 'any_other_id_2',
               itemId: 'any_other_item_id_2',
               price: 12,
               quantity: 3,
            },
         ],
      };
      const sut = new UpdateBillUseCase(mockRepository);
      await expect(sut.execute({ ...input, name: '' })).rejects.toThrow(
         new Error('Bill not exists')
      );
   });
});
