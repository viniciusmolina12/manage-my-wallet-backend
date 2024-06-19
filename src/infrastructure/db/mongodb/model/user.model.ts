import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    resetPassword: {
        token: String,
        expiresIn: Date,
       
    }
})

export default mongoose.model('User', UserSchema);;

