export class Filter<T> {
   constructor(
      public readonly page: number,
      public readonly limit: number,
      public readonly order: string,
      public readonly search: T
   ) {}

   get skip() {
      return (this.page - 1) * this.limit;
   }
}

export class Pagination<T> {
   constructor(
      public readonly page: number,
      public readonly perPage: number,
      public readonly total: number,
      public readonly hasNext: boolean,
      public readonly data: T[]
   ) {}
}
