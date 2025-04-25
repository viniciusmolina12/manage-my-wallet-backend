import ENV from '@config/env';
import { JsonWebTokenJwtGenerator } from '@infrastructure/jwt';

const jsonWebTokenGenerator = new JsonWebTokenJwtGenerator();
const token = jsonWebTokenGenerator.generateJwt(
   {
      userId: 'any_user_id',
      email: 'any_email',
      name: 'any_name',
   },
   ENV.SECRET_KEY,
   '1h'
);

export default token;
