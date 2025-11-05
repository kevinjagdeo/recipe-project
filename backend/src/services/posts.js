import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
//import { Types } from 'mongoose'

export async function createPost(userId, { title, content, imageUrl, tags }) {
  const post = new Post({ title, author: userId, content, imageUrl, tags })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []

  return await listPosts({ author: user._id }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

/*export async function getPostById(postId) {
  return await Post.findById(postId)
}*/

export async function getPostById(postId) {
  const post = await Post.findById(postId)
  if (!post) return null

  // Ensure these fields exist
  post.likes = post.likes ?? 0
  post.likedBy = post.likedBy ?? []

  return post
}

export async function updatePost(
  userId,
  postId,
  { title, content, imageUrl, tags },
) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, content, imageUrl, tags } },
    { new: true },
  )
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}

export async function addLikeToPost(postId, username) {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('User not found')
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likedBy: user._id } }, // Add user to likedBy without duplicates
    { new: true },
  )

  if (!updatedPost) {
    throw new Error('Post not found')
  }

  return updatedPost
}

export async function toggleLikePost(postId, userId) {
  const user = await User.findById(userId) // Use findById with userId
  if (!user) {
    throw new Error('User not found')
  }

  const post = await Post.findById(postId)
  if (!post) {
    throw new Error('Post not found')
  }

  // Check if user has already liked the post
  const likedIndex = post.likedBy.findIndex((id) => id.equals(user._id))

  if (likedIndex === -1) {
    // Add user to likedBy
    post.likedBy.push(user._id)
  } else {
    // Remove user from likedBy
    post.likedBy.splice(likedIndex, 1)
  }

  // Update likesCount if you maintain this field
  post.likesCount = post.likedBy.length

  await post.save()

  return post
}
