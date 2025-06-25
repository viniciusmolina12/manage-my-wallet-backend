import Entity from '../entity.interface';
import EntityError from '../error/entity.error';

export class Email {
   private _value: string;
   constructor(value: string) {
      this._value = value;
      this.validate();
   }

   private validate(): void {
      const re =
         /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(this._value).toLowerCase())) {
         throw new EntityError('Invalid email');
      }
   }

   toString(): string {
      return this._value;
   }

   valueOf(): string {
      return this._value;
   }

   [Symbol.toPrimitive](hint: string): string {
      return this._value;
   }
}
