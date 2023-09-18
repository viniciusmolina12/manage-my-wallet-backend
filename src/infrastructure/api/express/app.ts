import express, { Express } from 'express';
import itemRoutes from './routes/item.routes';
export const app: Express = express();
app.use(express.json());
app.use(itemRoutes)