export default interface JwtGenerator {
    generateJwt(data: any, secret: string, expiresIn?: Date): string;
}
