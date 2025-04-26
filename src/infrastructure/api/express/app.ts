import express, { Express } from 'express';
import itemRoutes from './routes/item.routes';
import categoryRoutes from './routes/category.routes';
import billRoutes from './routes/bill.routes';
import userRoutes from './routes/user.routes';
import vendorRoutes from './routes/vendor.routes';

export const app: Express = express();
app.use(express.json());
app.use(itemRoutes);
app.use(categoryRoutes);
app.use(billRoutes);
app.use(userRoutes);
app.use(vendorRoutes);
