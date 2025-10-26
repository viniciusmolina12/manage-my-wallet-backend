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
import ZodValidator from '@infrastructure/validation/zod.validator';
import { VENDOR_CONTROLLER_SCHEMAS } from '@infrastructure/api/express/schemas/vendor';
import { SearchVendor } from '@core/domain/vendor/repository/vendor.repository';
import { Filter } from '@core/domain/@shared/filter/filter';
const route = Router();

route.post(
   '/api/vendor',
   authMiddleware,
   async (req: Request, res: Response) => {
      const mongoDbVendorRepository = new MongoDbVendorRepository();
      const createVendorUseCase = new CreateVendorUseCase(
         mongoDbVendorRepository
      );
      const validator = new ZodValidator(VENDOR_CONTROLLER_SCHEMAS.CREATE);
      const controller = new CreateVendorController(
         createVendorUseCase,
         validator
      );
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
      const validator = new ZodValidator(VENDOR_CONTROLLER_SCHEMAS.FIND);
      const controller = new FindVendorController(findVendorUseCase, validator);
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
      const validator = new ZodValidator(VENDOR_CONTROLLER_SCHEMAS.LIST);
      const controller = new ListVendorController(listVendorUseCase, validator);
      const filter = new Filter(
         parseInt(req.query.page as string) || 1,
         parseInt(req.query.perPage as string) || 10,
         req.query.order as string,
         req.query.search as SearchVendor
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
      const validator = new ZodValidator(VENDOR_CONTROLLER_SCHEMAS.DELETE);
      const controller = new DeleteVendorController(
         deleteVendorUseCase,
         validator
      );
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
      const validator = new ZodValidator(VENDOR_CONTROLLER_SCHEMAS.UPDATE);
      const controller = new UpdateVendorController(
         updateVendorUseCase,
         validator
      );
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
