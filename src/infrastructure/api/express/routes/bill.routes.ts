import { Router, Request, Response } from 'express';

import CreateBillUseCase from '@core/usecases/bill/create/create.usecase';
import CreateBillController from '@controllers/bill/create.bill.controller';
import MongoDbBillRepository from '@infrastructure/db/mongodb/repositories/bill/bill.repository';
import FindBillUseCase from '@core/usecases/bill/find/find.usecase';
import FindBillController from '@controllers/bill/find.bill.controller';
import UpdateBillUseCase from '@core/usecases/bill/update/update.usecase';
import UpdateBillController from '@controllers/bill/update.bill.controller';
import ListBillUseCase from '@core/usecases/bill/list/list.usecase';
import ListBillController from '@controllers/bill/list.bill.controller';
import DeleteBillUseCase from '@core/usecases/bill/delete/delete.usecase';
import DeleteBillController from '@controllers/bill/delete.bill.controller';

const route = Router();

route.post('/api/bill', async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const createItemUseCase = new CreateBillUseCase(mongoDbBillRepository);
   const controller = new CreateBillController(createItemUseCase);
   const { code, ...data } = await controller.handle({ data: req.body });
   res.status(code).send(data);
});

route.get('/api/bill/:id', async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const findBillUseCase = new FindBillUseCase(mongoDbBillRepository);
   const controller = new FindBillController(findBillUseCase);
   const { code, ...data } = await controller.handle({
      data: { id: req.params.id as string },
   });
   res.status(code).send(data);
});

route.put('/api/bill/:id', async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const updateBillUseCase = new UpdateBillUseCase(mongoDbBillRepository);
   const controller = new UpdateBillController(updateBillUseCase);
   const { code, ...data } = await controller.handle({
      data: { ...req.body, id: req.params.id as string },
   });
   res.status(code).send(data);
});
route.get('/api/bills', async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const listBillUseCase = new ListBillUseCase(mongoDbBillRepository);
   const controller = new ListBillController(listBillUseCase);
   const { code, ...data } = await controller.handle({ data: {} });
   res.status(code).send(data);
});

route.delete('/api/bill/:id', async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const deleteBillUseCase = new DeleteBillUseCase(mongoDbBillRepository);
   const controller = new DeleteBillController(deleteBillUseCase);
   const { code, ...data } = await controller.handle({
      data: { id: req.params.id as string },
   });
   res.status(code).send(data);
});
export default route;
