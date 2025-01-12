import bcrypt from 'bcrypt';
import Encrypt from "@core/domain/interfaces/encrypt.interface";
export default class BcryptEncrypt implements Encrypt {
    encrypt(value: string, salts: number): string | null {
        if(!value || !salts) return null;
        return bcrypt.hashSync(value, salts);
    }
}