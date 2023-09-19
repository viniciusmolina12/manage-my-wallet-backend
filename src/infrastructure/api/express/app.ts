import express, { Express } from 'express';
import itemRoutes from './routes/item.routes';
import categoryRoutes from './routes/category.routes';
export const app: Express = express();
app.use(express.json());
app.use(itemRoutes)
app.use(categoryRoutes)