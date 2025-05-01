require('module-alias/register');
import 'dotenv/config';
import { app } from './app';
import { connect } from '@infrastructure/db/mongodb';
connect();
app.listen(
   parseInt(process.env.PORT as string) || 3000,
   '0.0.0.0',
   100,
   async () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
   }
);
