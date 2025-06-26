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
   vendorId: { type: String, ref: 'Vendor', required: true },
   description: { type: String, required: false },
   date: { type: Date, required: true },
   items: [
      {
         _id: { type: String, required: true },
         itemId: { type: String, ref: 'Item', required: true },
         quantity: { type: Number, required: true },
         price: { type: Number, required: true },
      },
   ],
   userId: { type: String, ref: 'User', required: true },
   total: { type: Number, required: true },
   createdAt: { type: Date, required: true, default: Date.now },
   updatedAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Bill', BillSchema);
