import mongoose from 'mongoose';

const { Schema } = mongoose;

const VendorSchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   userId: { type: String, required: true },
});

export default mongoose.model('Vendor', VendorSchema);
