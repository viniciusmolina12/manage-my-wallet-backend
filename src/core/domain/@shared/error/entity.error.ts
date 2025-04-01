export default class EntityError extends Error {
   constructor(message: string) {
      super('EntityError');
      this.message = message;
   }
}
