import bcrypt from 'bcrypt';
import Encrypt from '@core/interfaces/encrypt.interface';
export default class BcryptEncrypt implements Encrypt {
   encrypt(value: string, salts: number): string | null {
      if (!value || !salts) return null;
      return bcrypt.hashSync(value, salts);
   }

   compare(value: string, hash: string): boolean {
      if (!value || !hash) return false;
      return bcrypt.compareSync(value, hash);
   }
}
