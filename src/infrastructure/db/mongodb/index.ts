import mongoose from "mongoose";

export const connect = async () =>{
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/manage-my-wallet');
}