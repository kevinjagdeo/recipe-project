import mongoose, { Schema } from 'mongoose'
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    content: String,
    //add schema for image URL
    imageUrl: { type: String },
    tags: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true },
)
export const Post = mongoose.model('post', postSchema)
