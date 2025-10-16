import { z } from 'zod';
import ZodValidator from './zod.validator';

describe('ZodValidator', () => {
   it('should return a valid result when the data is valid', () => {
      const sut = new ZodValidator(z.object({ name: z.string() }));
      const result = sut.validate({ name: 'John Doe' });
      expect(result.success).toBe(true);
      expect(result.errors).toEqual([]);
   });

   it('should return an invalid result when the data is invalid', () => {
      const sut = new ZodValidator(
         z.object({ name: z.string().min(1, 'Nome é obrigatório') })
      );
      const result = sut.validate({ name: '' });
      expect(result.success).toBe(false);
      expect(result.errors).toEqual(['Nome é obrigatório']);
   });
});
