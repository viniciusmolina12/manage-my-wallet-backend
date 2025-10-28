import mongoose from 'mongoose';

export const connect = async () => {
   try {
      await mongoose.connect(
         process.env.MONGO_URL || 'mongodb://127.0.0.1ss:27017/manage-my-wallet'
      );
   } catch (error) {
      console.error('Error connecting to MongoDB!!!:', error);
   }
};
