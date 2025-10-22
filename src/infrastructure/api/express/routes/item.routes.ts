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
import { authMiddleware } from '../middlewares/authMiddleware';
import ZodValidator from '@infrastructure/validation/zod.validator';
import { ITEM_CONTROLLER_SCHEMAS } from '../schemas/item';
import { SearchItem } from '@core/domain/item/repository/item.repository';
import { Filter } from '@core/domain/@shared/filter/filter';

const route = Router();

route.post('/api/item', authMiddleware, async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const createItemUseCase = new CreateItemUseCase(mongoDbItemRepository);
   const validator = new ZodValidator(ITEM_CONTROLLER_SCHEMAS.CREATE);
   const controller = new CreateItemController(createItemUseCase, validator);
   const { code, ...data } = await controller.handle({
      data: {
         ...req.body,
         userId: req.userId as string,
      },
   });
   res.status(code).send(data);
});

route.get(
   '/api/item/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbItemRepository = new MongoDbItemRepository();
      const findItemUseCase = new FindItemUseCase(mongoDbItemRepository);
      const validator = new ZodValidator(ITEM_CONTROLLER_SCHEMAS.FIND);
      const controller = new FindItemController(findItemUseCase, validator);
      const { code, ...data } = await controller.handle({
         data: { id: req.params.id as string, userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);

route.put(
   '/api/item/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbItemRepository = new MongoDbItemRepository();
      const updateItemUseCase = new UpdateItemUseCase(mongoDbItemRepository);
      const validator = new ZodValidator(ITEM_CONTROLLER_SCHEMAS.UPDATE);
      const controller = new UpdateItemController(updateItemUseCase, validator);
      const { code, ...data } = await controller.handle({
         data: {
            ...req.body,
            id: req.params.id as string,
            userId: req.userId as string,
         },
      });
      res.status(code).send(data);
   }
);
route.get('/api/items', authMiddleware, async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbItemRepository();
   const listItemUseCase = new ListItemUsecase(mongoDbItemRepository);
   const validator = new ZodValidator(ITEM_CONTROLLER_SCHEMAS.LIST);
   const controller = new ListItemController(listItemUseCase, validator);
   const filter = new Filter(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.perPage as string) || 10,
      req.query.order as string,
      req.query.search as SearchItem
   );
   const { code, ...data } = await controller.handle({
      data: {
         userId: req.userId as string,
         page: parseInt(req.query.page as string) || 1,
         perPage: parseInt(req.query.perPage as string) || 10,
         order: req.query.order as string,
         search: { name: req.query.name as string },
      },
   });
   res.status(code).send(data);
});

route.delete(
   '/api/item/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbItemRepository = new MongoDbItemRepository();
      const deleteItemUseCase = new DeleteItemUseCase(mongoDbItemRepository);
      const validator = new ZodValidator(ITEM_CONTROLLER_SCHEMAS.DELETE);
      const controller = new DeleteItemController(deleteItemUseCase, validator);
      const { code, ...data } = await controller.handle({
         data: { id: req.params.id as string, userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);
export default route;
