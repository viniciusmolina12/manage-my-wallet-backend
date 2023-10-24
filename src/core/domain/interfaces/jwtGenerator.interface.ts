export default interface JwtGenerator {
    generateJWT(payload: any): Promise<string>
}
