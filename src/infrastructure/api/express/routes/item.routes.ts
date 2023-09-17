import { Router, Request, Response } from 'express';
import MongoDbItemRepository from '../../../db/mongodb/repositories/item/item.repository';
import { CreateItemUseCase } from '../../../../core/usecases/item/create/create.usecase';
import CreateItemController from '../../../../controllers/item/create.item.controller';

const route = Router();

route.post('/item', async (req: Request, res: Response) => {
    const mongoDbItemRepository = new MongoDbItemRepository();
    const createItemUseCase = new CreateItemUseCase(mongoDbItemRepository);
    const controller = new CreateItemController(createItemUseCase)
    const response = await controller.handle({ data: req.body })
    res.status(response.code);
    res.send({ data: response.data, message: response.message})
})

export default route;