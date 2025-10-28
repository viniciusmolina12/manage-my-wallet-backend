import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';
import categoryRoutes from './routes/category.routes';
import billRoutes from './routes/bill.routes';
import userRoutes from './routes/user.routes';
import vendorRoutes from './routes/vendor.routes';

export const app: Express = express();
app.use(cors());
app.use(express.json());
app.get(`/api/health`, (req: Request, res: Response) => {
   res.status(200).json({ message: 'API is running successfully!' });
});
app.use(itemRoutes);
app.use(categoryRoutes);
app.use(billRoutes);
app.use(userRoutes);
app.use(vendorRoutes);
