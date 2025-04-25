import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   description: { type: String, required: false },
   userId: { type: String, required: true },
});

export default mongoose.model('Category', CategorySchema);
