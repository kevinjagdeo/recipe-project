import { Post } from '../db/models/post.js'
export async function createPost({ title, author, content, imageUrl, tags }) {
  const post = new Post({ title, author, content, imageUrl, tags })
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
export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}
export async function getPostById(postId) {
  return await Post.findById(postId)
}
export async function updatePost(
  postId,
  { title, author, content, imageUrl, tags },
) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, content, imageUrl, tags } },
    { new: true },
  )
}
export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}
