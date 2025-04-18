import mongoose from 'mongoose';

const { Schema } = mongoose;

const ItemSchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   description: { type: String, required: false },
   categoryId: { type: String, required: true },
});

export default mongoose.model('Item', ItemSchema);
