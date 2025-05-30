import { CreateVendorUseCase } from '@core/usecases/vendor/create/create.usecase';
import MongoDbVendorRepository from '@infrastructure/db/mongodb/repositories/vendor/vendor.repository';
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import CreateVendorController from '@controllers/vendor/create.vendor.controller';
import FindVendorController from '@controllers/vendor/find.vendor.controller';
import { FindVendorUseCase } from '@core/usecases/vendor/find/find.usecase';
import ListVendorController from '@controllers/vendor/list.vendor.controller';
import { ListVendorUseCase } from '@core/usecases/vendor/list/list.usecase';
import DeleteVendorController from '@controllers/vendor/delete.vendor.controller';
import DeleteVendorUseCase from '@core/usecases/vendor/delete/delete.usecase';
import UpdateVendorController from '@controllers/vendor/update.vendor.controller';
import { UpdateVendorUseCase } from '@core/usecases/vendor/update/update.usecase';
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

route.get(
   '/api/vendors',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const listVendorUseCase = new ListVendorUseCase(mongoDbVendorRepository);
      const controller = new ListVendorController(listVendorUseCase);
      const { code, ...data } = await controller.handle({
         data: { userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);

route.delete(
   '/api/vendor/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const deleteVendorUseCase = new DeleteVendorUseCase(
         mongoDbVendorRepository
      );
      const controller = new DeleteVendorController(deleteVendorUseCase);
      const { code, ...data } = await controller.handle({
         data: { id: req.params.id, userId: req.userId as string },
      });
      res.status(code).send(data);
   }
);

route.put(
   '/api/vendor/:id',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const updateVendorUseCase = new UpdateVendorUseCase(
         mongoDbVendorRepository
      );
      const controller = new UpdateVendorController(updateVendorUseCase);
      const { code, ...data } = await controller.handle({
         data: {
            id: req.params.id,
            name: req.body.name,
            userId: req.userId as string,
         },
      });
      res.status(code).send(data);
   }
);
export default route;
