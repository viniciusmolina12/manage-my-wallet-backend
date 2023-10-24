export default interface JwtGenerator {
    generateJWT(payload: any, options?: any): Promise<string>
}
