import ENV from '@config/env';
import { JsonWebTokenJwtGenerator } from '@infrastructure/jwt';

const jsonWebTokenGenerator = new JsonWebTokenJwtGenerator();
const token = jsonWebTokenGenerator.generateJwt(
   {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'any_email',
      name: 'any_name',
   },
   ENV.SECRET_KEY,
   '1h'
);

export default token;
