import { Router, Request, Response } from "express";
import CreateUserController from "@controllers/user/create.user.controller";
import CreateUserUseCase from "@core/usecases/user/create/create.usecase";
import MongoDbUserRepository from "@infrastructure/db/mongodb/repositories/user/user.repository";
import BcryptEncrypt from "@infrastructure/encrypt";
import { JsonWebTokenJwtGenerator } from "@infrastructure/jwt";


const route = Router();

route.post('/api/user', async (req: Request, res: Response) => {
    const mongoDbItemRepository = new MongoDbUserRepository();
    const bcryptEncrypt = new BcryptEncrypt();
    const jsonWebTokenJwtGenerator = new JsonWebTokenJwtGenerator();
    const createItemUseCase = new CreateUserUseCase(mongoDbItemRepository, bcryptEncrypt, jsonWebTokenJwtGenerator);
    const controller = new CreateUserController(createItemUseCase)
    const response = await controller.handle({ data: req.body })
    res.status(response.code);
    res.send({ data: response.data, message: response.message})
});

export default route;