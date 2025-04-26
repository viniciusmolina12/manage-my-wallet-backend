import { CreateVendorUseCase } from '@core/usecases/vendor/create/create.usecase';
import MongoDbVendorRepository from '@infrastructure/db/mongodb/repositories/vendor/vendor.repository';
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import CreateVendorController from '@controllers/vendor/create.vendor.controller';
import FindVendorController from '@controllers/vendor/find.vendor.controller';
import { FindVendorUseCase } from '@core/usecases/vendor/find/find.usecase';

const route = Router();

route.post(
   '/api/vendor',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const createVendorUseCase = new CreateVendorUseCase(
         mongoDbVendorRepository
      );
      const controller = new CreateVendorController(createVendorUseCase);
      const { code, ...data } = await controller.handle({
         data: { ...req.body, userId: req.userId },
      });
      res.status(code).send(data);
   }
);

route.get(
   '/api/vendor/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const findVendorUseCase = new FindVendorUseCase(mongoDbVendorRepository);
      const controller = new FindVendorController(findVendorUseCase);
      const { code, ...data } = await controller.handle({
         data: { id: req.params.id, userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);
export default route;
