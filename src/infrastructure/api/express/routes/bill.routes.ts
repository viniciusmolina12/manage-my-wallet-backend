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
import SummaryBillUseCase from '@core/usecases/bill/summary/summary.usecase';
import SummaryBillController from '@controllers/bill/summary.bill.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import MongoDbItemRepository from '@infrastructure/db/mongodb/repositories/item/item.repository';
import MongoDbVendorRepository from '@infrastructure/db/mongodb/repositories/vendor/vendor.repository';
import { PeriodType } from '@core/usecases/bill/summary/periods';
import MongoDbCategoryRepository from '@infrastructure/db/mongodb/repositories/category/category.repository';
const route = Router();

route.post('/api/bill', authMiddleware, async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const mongoDbItemRepository = new MongoDbItemRepository();
   const mongoDbVendorRepository = new MongoDbVendorRepository();
   const mongoDbCategoryRepository = new MongoDbCategoryRepository();
   const createItemUseCase = new CreateBillUseCase(
      mongoDbBillRepository,
      mongoDbItemRepository,
      mongoDbVendorRepository
   );
   const findBillUseCase = new FindBillUseCase(
      mongoDbBillRepository,
      mongoDbItemRepository,
      mongoDbVendorRepository,
      mongoDbCategoryRepository
   );
   const controller = new CreateBillController(
      createItemUseCase,
      findBillUseCase
   );
   const { code, ...data } = await controller.handle({
      data: { ...req.body, userId: req.userId },
   });
   res.status(code).send(data);
});

route.get(
   '/api/bill/summary',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbBillRepository = new MongoDbBillRepository();
      const mongoDbItemRepository = new MongoDbItemRepository();
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const mongoDbCategoryRepository = new MongoDbCategoryRepository();
      const summaryBillUseCase = new SummaryBillUseCase(
         mongoDbBillRepository,
         mongoDbVendorRepository,
         mongoDbItemRepository,
         mongoDbCategoryRepository
      );
      const controller = new SummaryBillController(summaryBillUseCase);
      const { code, ...data } = await controller.handle({
         data: {
            userId: req.userId as string,
            period: req.query.period as PeriodType,
         },
      });
      res.status(code).send(data);
   }
);

route.get(
   '/api/bill/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbBillRepository = new MongoDbBillRepository();
      const mongoDbItemRepository = new MongoDbItemRepository();
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const mongoDbCategoryRepository = new MongoDbCategoryRepository();
      const findBillUseCase = new FindBillUseCase(
         mongoDbBillRepository,
         mongoDbItemRepository,
         mongoDbVendorRepository,
         mongoDbCategoryRepository
      );
      const controller = new FindBillController(findBillUseCase);
      const { code, ...data } = await controller.handle({
         data: { id: req.params.id as string, userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);

route.put(
   '/api/bill/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbBillRepository = new MongoDbBillRepository();
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const updateBillUseCase = new UpdateBillUseCase(
         mongoDbBillRepository,
         mongoDbVendorRepository
      );
      const controller = new UpdateBillController(updateBillUseCase);
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
route.get('/api/bills', authMiddleware, async (req: Request, res: Response) => {
   const mongoDbBillRepository = new MongoDbBillRepository();
   const listBillUseCase = new ListBillUseCase(mongoDbBillRepository);
   const controller = new ListBillController(listBillUseCase);
   const search = {
      name: req.query.name as string,
      vendorId: req.query.vendorId as string,
      startDate: req.query.startDate
         ? new Date(req.query.startDate as string)
         : undefined,
      endDate: req.query.endDate
         ? new Date(req.query.endDate as string)
         : undefined,
   };
   const { code, ...data } = await controller.handle({
      data: {
         userId: req.userId as string,
         page: parseInt(req.query.page as string) || 1,
         perPage: parseInt(req.query.perPage as string) || 10,
         order: req.query.order as string,
         search,
      },
   });
   res.status(code).send(data);
});

route.delete(
   '/api/bill/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbBillRepository = new MongoDbBillRepository();
      const deleteBillUseCase = new DeleteBillUseCase(mongoDbBillRepository);
      const controller = new DeleteBillController(deleteBillUseCase);
      const { code, ...data } = await controller.handle({
         data: { id: req.params.id as string, userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);

export default route;
