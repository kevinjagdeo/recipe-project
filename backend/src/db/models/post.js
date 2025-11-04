import mongoose, { Schema, Types } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: String,
    imageUrl: { type: String },
    likedBy: [{ type: Types.ObjectId, ref: 'User' }], // fixed import and ref
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('Post', postSchema) // capitalized model name
