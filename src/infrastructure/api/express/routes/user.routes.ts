import { Router, Request, Response, json } from 'express';
import { JsonWebTokenJwtGenerator } from '@infrastructure/jwt';
import CreateUserController from '@controllers/user/create.user.controller';
import CreateUserUseCase from '@core/usecases/user/create/create.usecase';
import MongoDbUserRepository from '@infrastructure/db/mongodb/repositories/user/user.repository';
import BcryptEncrypt from '@infrastructure/encrypt';
import UpdateUserController from '@controllers/user/update.user.controller';
import UpdateUserUseCase from '@core/usecases/user/update/update.usecase';
import LoginUserController from '@controllers/user/login.user.controller';
import LoginUserUseCase from '@core/usecases/user/login/login.usecase';
import ResetPasswordUserUseCase from '@core/usecases/user/reset-password/reset_password.usecase';
import ResetPasswordUserController from '@controllers/user/reset-password.controller';
import RecoverPasswordUserUseCase from '@core/usecases/user/recover-password/recover_password.usecase';
import { NodeMailerMailer } from '@infrastructure/mailer/node-mailer';
import ENV from '@config/env';
import RecoverPasswordUserController from '@controllers/user/recover-password.user.controller';

const route = Router();

route.post('/api/user', async (req: Request, res: Response) => {
   const mongoDbItemRepository = new MongoDbUserRepository();
   const bcryptEncrypt = new BcryptEncrypt();
   const jsonWebTokenJwtGenerator = new JsonWebTokenJwtGenerator();
   const createItemUseCase = new CreateUserUseCase(
      mongoDbItemRepository,
      bcryptEncrypt,
      jsonWebTokenJwtGenerator
   );
   const controller = new CreateUserController(createItemUseCase);
   const { code, ...data } = await controller.handle({ data: req.body });
   res.status(code).send(data);
});

route.patch('/api/user/:id', async (req: Request, res: Response) => {
   const mongoDbUserRepository = new MongoDbUserRepository();
   const updateUserUseCase = new UpdateUserUseCase(mongoDbUserRepository);
   const controller = new UpdateUserController(updateUserUseCase);
   const { code, ...data } = await controller.handle({
      data: { ...req.body, id: req.params.id },
   });
   res.status(code).send(data);
});

route.post('/api/login', async (req: Request, res: Response) => {
   const mongoDbUserRepository = new MongoDbUserRepository();
   const bcryptEncrypt = new BcryptEncrypt();
   const jsonWebTokenJwtGenerator = new JsonWebTokenJwtGenerator();
   const loginUserUseCase = new LoginUserUseCase(
      mongoDbUserRepository,
      bcryptEncrypt,
      jsonWebTokenJwtGenerator
   );
   const controller = new LoginUserController(loginUserUseCase);
   const { code, ...data } = await controller.handle({ data: { ...req.body } });
   res.status(code).send(data);
});

route.post('/api/reset-password', async (req: Request, res: Response) => {
   const mongoDbUserRepository = new MongoDbUserRepository();
   const bcryptEncrypt = new BcryptEncrypt();
   const resetPasswordUserUseCase = new ResetPasswordUserUseCase(
      mongoDbUserRepository,
      bcryptEncrypt
   );
   const controller = new ResetPasswordUserController(resetPasswordUserUseCase);
   const { code, ...data } = await controller.handle({ data: { ...req.body } });
   res.status(code).send(data);
});

route.post('/api/recover-password', async (req: Request, res: Response) => {
   const mongoDbUserRepository = new MongoDbUserRepository();
   const jsonWebTokenJwtGenerator = new JsonWebTokenJwtGenerator();
   const nodemailerMailer = new NodeMailerMailer({
      host: ENV.MAILER_HOST,
      port: ENV.MAILER_PORT as unknown as number,
      auth: { user: ENV.MAILER_AUTH_USER, pass: ENV.MAILER_AUTH_PASSWORD },
   });
   const recoverPasswordUserUseCase = new RecoverPasswordUserUseCase(
      mongoDbUserRepository,
      nodemailerMailer,
      jsonWebTokenJwtGenerator
   );
   const controller = new RecoverPasswordUserController(
      recoverPasswordUserUseCase
   );
   const { code, ...data } = await controller.handle({ data: { ...req.body } });
   res.status(code).send(data);
});
export default route;
