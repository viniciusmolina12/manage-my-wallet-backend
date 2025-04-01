require('module-alias/register');
import 'dotenv/config';
import { app } from './app';
import { connect } from '@infrastructure/db/mongodb';
connect();
app.listen(process.env.PORT || 3000, async () => {
   console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
