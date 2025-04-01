import mongoose from 'mongoose';

const { Schema } = mongoose;

const BillItemSchema = new Schema({
   _id: String,
   itemId: { type: String, required: true },
   price: { type: Number, required: true },
   quantity: { type: Number, required: true },
});

const BillSchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   description: { type: String, required: false },
   items: [
      {
         _id: { type: String, required: true },
         itemId: { type: String, ref: 'Item', required: true },
         quantity: { type: Number, required: true },
         price: { type: Number, required: true },
      },
   ],
   createdDate: { type: Date, required: true },
});

export default mongoose.model('Bill', BillSchema);
