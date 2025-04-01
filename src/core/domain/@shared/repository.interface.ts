export interface RepositoryInterface<T> {
   create(entity: T): Promise<void>;
   update(entity: T): Promise<void | T>;
   find(id: string): Promise<T | null>;
   findAll(): Promise<T[]>;
   delete(id: string): Promise<void>;
}
