import { RepositoryInterface } from "../../@shared/repository.interface";
import User from "../entity/user.entity";

export interface UserRepository extends RepositoryInterface<User> {}