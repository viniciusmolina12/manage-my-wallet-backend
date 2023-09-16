import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export default {
    connect: async () => {
        mongod = await MongoMemoryServer.create();        
        await mongoose.connect(mongod.getUri());
    
    },
    disconnect: async () => {
        await mongoose.disconnect();
        await mongod.stop();
    },
    clear: async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
     }
}