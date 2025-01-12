import jwt from 'jsonwebtoken';
import JwtGenerator from "@core/domain/interfaces/jwtGenerator.interface";

export class JsonWebTokenJwtGenerator implements JwtGenerator {
    generateJwt(data: any, secret: string, expiresIn?: string): string {
        return jwt.sign(data, secret, { expiresIn });
    }

    verify(token: string, secret: string): any {
        return jwt.verify(token, secret, (err, decoded) => {
            if(decoded == 'undefined') return false;
            return decoded;
        })
    }
}