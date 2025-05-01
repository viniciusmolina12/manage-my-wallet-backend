import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   description: { type: String, required: false },
   userId: { type: String, required: true },
   createdAt: { type: Date, required: true, default: Date.now },
   updatedAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Category', CategorySchema);
