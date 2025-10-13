import {
   Validator,
   ValidatorResult,
} from '@core/domain/interfaces/validator.interface';
import { z } from 'zod';

export class ZodValidator implements Validator {
   constructor(private readonly schema: z.ZodSchema) {
      this.schema = schema;
   }
   validate(data: any): ValidatorResult {
      const result = this.schema.safeParse(data);
      if (!result.success) {
         return {
            success: false,
            errors: result.error.issues.map((issue) => issue.message),
         };
      }
      return {
         success: true,
         errors: [],
      };
   }
}

export default ZodValidator;
