import { Router, Request, Response } from 'express';
import MongoDbItemRepository from '@infrastructure/db/mongodb/repositories/item/item.repository';

import CreateItemController from '@controllers/item/create.item.controller';
import FindItemController from '@controllers/item/find.item.controller';
import UpdateItemController from '@controllers/item/update.item.controller';
import DeleteItemController from '@controllers/item/delete.item.controller';
import ListItemController from '@controllers/item/list.item.controller';

import CreateItemUseCase from '@core/usecases/item/create/create.usecase';
import FindItemUseCase from '@core/usecases/item/find/find.usecase';
import UpdateItemUseCase from '@core/usecases/item/update/update.usecase';
import DeleteItemUseCase from '@core/usecases/item/delete/delete.usecase';
import ListItemUsecase from '@core/usecases/item/list/list.usecase';

const route = Router();

route.post('/api/item', async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const createItemUseCase = new CreateItemUseCase(mongoDbItemRepository);
   const controller = new CreateItemController(createItemUseCase);
   const { code, ...data } = await controller.handle({ data: req.body });
   res.status(code).send(data);
});

route.get('/api/item/:id', async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const findItemUseCase = new FindItemUseCase(mongoDbItemRepository);
   const controller = new FindItemController(findItemUseCase);
   const { code, ...data } = await controller.handle({
      data: { id: req.params.id as string },
   });
   res.status(code).send(data);
});

route.put('/api/item/:id', async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const updateItemUseCase = new UpdateItemUseCase(mongoDbItemRepository);
   const controller = new UpdateItemController(updateItemUseCase);
   const { code, ...data } = await controller.handle({
      data: { ...req.body, id: req.params.id as string },
   });
   res.status(code).send(data);
});
route.get('/api/items', async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const listItemUseCase = new ListItemUsecase(mongoDbItemRepository);
   const controller = new ListItemController(listItemUseCase);
   const { code, ...data } = await controller.handle({ data: {} });
   res.status(code).send(data);
});

route.delete('/api/item/:id', async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const deleteItemUseCase = new DeleteItemUseCase(mongoDbItemRepository);
   const controller = new DeleteItemController(deleteItemUseCase);
   const { code, ...data } = await controller.handle({
      data: { id: req.params.id as string },
   });
   res.status(code).send(data);
});
export default route;
