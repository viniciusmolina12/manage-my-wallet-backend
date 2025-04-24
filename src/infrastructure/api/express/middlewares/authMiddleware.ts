import ENV from '@config/env';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
   namespace Express {
      interface Request {
         userId?: string;
      }
   }
}

export const authMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
   }

   const token = authHeader.split(' ')[1];

   try {
      const decoded = jwt.verify(token, ENV.SECRET_KEY) as { userId: string };
      req.userId = decoded.userId;

      next();
   } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
   }
};
