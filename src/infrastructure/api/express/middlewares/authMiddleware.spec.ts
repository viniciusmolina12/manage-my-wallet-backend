import express, { Request, Response } from 'express';
import request from 'supertest';
import ENV from '@config/env';
import { authMiddleware } from './authMiddleware';
import { JsonWebTokenJwtGenerator } from '@infrastructure/jwt';
describe('Auth Middleware', () => {
   let app: express.Express;

   beforeEach(() => {
      app = express();
      app.get('/protected', authMiddleware, (req: Request, res: Response) => {
         res.status(200).json({ userId: req.userId });
      });
   });

   it('should return status 401 if token is not provided', async () => {
      const res = await request(app).get('/protected');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Token não fornecido' });
   });

   it('should return error 401 if token is invalid', async () => {
      const res = await request(app)
         .get('/protected')
         .set('Authorization', 'Bearer invalid_token');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Token inválido' });
   });

   it('should allowed access with valid token and extract userId', async () => {
      const jsonwebtoken = new JsonWebTokenJwtGenerator();
      const token = jsonwebtoken.generateJwt(
         { userId: 'abc123' },
         ENV.SECRET_KEY,
         '1h'
      );

      const res = await request(app)
         .get('/protected')
         .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ userId: 'abc123' });
   });
});
