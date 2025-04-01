import { Router, Request, Response } from 'express';

import CreateCategoryUseCase from '@core/usecases/category/create/create.usecase';
import CreateCategoryController from '@controllers/category/create.category.controller';
import MongoDbCategoryRepository from '@infrastructure/db/mongodb/repositories/category/category.repository';
import FindCategoryUseCase from '@core/usecases/category/find/find.usecase';
import FindCategoryController from '@controllers/category/find.category.controller';
import UpdateCategoryUseCase from '@core/usecases/category/update/update.usecase';
import UpdateCategoryController from '@controllers/category/update.category.controller';
import ListCategoryUseCase from '@core/usecases/category/list/list.usecase';
import ListCategoryController from '@controllers/category/list.category.controller';
import DeleteCategoryUseCase from '@core/usecases/category/delete/delete.usecase';
import DeleteCategoryController from '@controllers/category/delete.category.controller';

const route = Router();

route.post('/api/category', async (req: Request, res: Response) => {
   const mongoDbCategoryRepository = new MongoDbCategoryRepository();
   const createItemUseCase = new CreateCategoryUseCase(
      mongoDbCategoryRepository
   );
   const controller = new CreateCategoryController(createItemUseCase);
   const { code, ...data } = await controller.handle({ data: req.body });
   res.status(code).send(data);
});

route.get('/api/category/:id', async (req: Request, res: Response) => {
   const mongoDbCategoryRepository = new MongoDbCategoryRepository();
   const findCategoryUseCase = new FindCategoryUseCase(
      mongoDbCategoryRepository
   );
   const controller = new FindCategoryController(findCategoryUseCase);
   const { code, ...data } = await controller.handle({
      data: { id: req.params.id as string },
   });
   res.status(code).send(data);
});

route.put('/api/category/:id', async (req: Request, res: Response) => {
   const mongoDbCategoryRepository = new MongoDbCategoryRepository();
   const updateCategoryUseCase = new UpdateCategoryUseCase(
      mongoDbCategoryRepository
   );
   const controller = new UpdateCategoryController(updateCategoryUseCase);
   const { code, ...data } = await controller.handle({
      data: { ...req.body, id: req.params.id as string },
   });
   res.status(code).send(data);
});
route.get('/api/categories', async (req: Request, res: Response) => {
   const mongoDbCategoryRepository = new MongoDbCategoryRepository();
   const listCategoryUseCase = new ListCategoryUseCase(
      mongoDbCategoryRepository
   );
   const controller = new ListCategoryController(listCategoryUseCase);
   const { code, ...data } = await controller.handle({ data: {} });
   res.status(code).send(data);
});

route.delete('/api/category/:id', async (req: Request, res: Response) => {
   const mongoDbCategoryRepository = new MongoDbCategoryRepository();
   const deleteCategoryUseCase = new DeleteCategoryUseCase(
      mongoDbCategoryRepository
   );
   const controller = new DeleteCategoryController(deleteCategoryUseCase);
   const { code, ...data } = await controller.handle({
      data: { id: req.params.id as string },
   });
   res.status(code).send(data);
});
export default route;
