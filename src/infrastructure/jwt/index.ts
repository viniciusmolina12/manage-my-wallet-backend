import jwt, { SignOptions } from 'jsonwebtoken';
import JwtGenerator from '@core/interfaces/jwtGenerator.interface';

export class JsonWebTokenJwtGenerator implements JwtGenerator {
   generateJwt(data: any, secret: string, expiresIn?: string): string {
      return jwt.sign(data, secret, { expiresIn } as SignOptions & {
         algorithm: 'none';
      });
   }

   verify(token: string, secret: string): any {
      return jwt.verify(token, secret, (err, decoded) => {
         if (decoded == 'undefined') return false;
         return decoded;
      });
   }
}
