import mongoose, { Schema } from 'mongoose'
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    //add schema for image URL
    image: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true },
)
export const Post = mongoose.model('post', postSchema)
