import bcrypt from 'bcrypt';
import Encrypt from "@core/domain/interfaces/encrypt.interface";
export default class BcryptEncrypt implements Encrypt {
    encrypt(value: string, salts: number): string {
        return bcrypt.hashSync(value, salts);
    }
}