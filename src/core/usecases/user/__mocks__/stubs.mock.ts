import Encrypt from "@core/domain/interfaces/encrypt.interface";
import JwtGenerator from "@core/domain/interfaces/jwtGenerator.interface";
import Mailer from "@core/domain/interfaces/mailer.interface";

export class EncryptStub implements Encrypt {
    encrypt(password: string): string {
        return 'encrypted_password'
    }
    generatePasswordRecoverToken(expiresIn?: Date): string {
        return 'token'
    }
}

export class JwtGeneratorStub implements JwtGenerator {
    generateJWT(id: string): Promise<string> {
        return Promise.resolve('any_token');
    }
}


export class MailerStub implements Mailer {
    sendMail(data: { to: string, from: string, subject: string, content: string}): Promise<void> {
        return Promise.resolve();
    }
}