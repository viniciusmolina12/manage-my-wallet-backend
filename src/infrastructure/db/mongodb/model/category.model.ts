import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema({
    _id: String,
    name: { type: String, required: true },
    description: { type: String, required: false },
})

export default mongoose.model('Category', CategorySchema);;

