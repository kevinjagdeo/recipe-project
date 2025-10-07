import mongoose, { Schema } from 'mongoose'
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    content: String,
    //add schema for image URL
    imageUrl: { type: String },
    tags: [String],
  },
  { timestamps: true },
)
export const Post = mongoose.model('post', postSchema)
