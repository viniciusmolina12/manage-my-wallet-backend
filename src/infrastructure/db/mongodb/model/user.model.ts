import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
   _id: String,
   name: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   resetPassword: {
      token: String,
      expiresIn: Date,
   },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
