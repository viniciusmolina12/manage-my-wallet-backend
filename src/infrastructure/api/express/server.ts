import express from 'express';
import itemRoutes from './routes/item.routes';
import { connect } from '../../db/mongodb';
const app = express()
app.use(express.json());
app.use(itemRoutes);
connect()

app.listen(process.env.PORT || 3005, async () => { 
    console.log(`Server is running on port ${process.env.PORT || 3005}` ) 
})