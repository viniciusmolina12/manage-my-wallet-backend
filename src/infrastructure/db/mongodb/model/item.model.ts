import mongoose from 'mongoose';

const { Schema } = mongoose;

const ItemSchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   description: { type: String, required: false },
   categoryId: { type: String, required: true },
   userId: { type: String, required: true },
   createdAt: { type: Date, required: true, default: Date.now },
   updatedAt: { type: Date, required: true, default: Date.now },
});

ItemSchema.pre('findOneAndDelete', async function (next: Function) {
   const bill = await mongoose.model('Bill').findOne({
      items: { $elemMatch: { itemId: this.getQuery()._id } },
   });
   if (bill) {
      throw new Error('Item is associated with a bill');
   }
   next();
});

export default mongoose.model('Item', ItemSchema);
