import mongoose from 'mongoose';

const { Schema } = mongoose;

const ItemSchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   description: { type: String, required: false },
   categoryId: { type: String, required: true },
   userId: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Item', ItemSchema);
