import Encrypt from "@core/domain/interfaces/encrypt.interface";
import JwtGenerator from "@core/domain/interfaces/jwtGenerator.interface";
import Mailer from "@core/domain/interfaces/mailer.interface";

export class EncryptStub implements Encrypt {
    encrypt(password: string): string {
        return 'encrypted_password'
    }
    compare(value: string, hash: string): boolean {
        return true;
    }
}

export class JwtGeneratorStub implements JwtGenerator {
    generateJwt(data: any, secret: string, expiresIn?: string): string {
        return 'any_token';
    }

    verify(token: string, secret: string) {
        return true;
    }
}


export class MailerStub implements Mailer {
    sendMail(data: { to: string, from: string, subject: string, content: string}): Promise<void> {
        return Promise.resolve();
    }
}