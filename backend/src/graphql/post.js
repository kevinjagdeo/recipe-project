import { getUserInfoById } from '../services/users.js'

export const postSchema = `#graphql
type Post {
  id: ID!
  title: String!
  author: User
  content: String
  tags: [String!]
  likes: [User!]!          # List of users who liked the post
  likesCount: Int!         # Convenience field to get total likes count
  createdAt: Float
  updatedAt: Float
}
`

export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author)
    },
    likes: async (post) => {
      // Assuming your Post model populates likes as user IDs
      // Populate user info from user service or DB
      return post.likes
        ? Promise.all(post.likes.map((id) => getUserInfoById(id)))
        : []
    },
    likesCount: (post) => {
      return post.likes ? post.likes.length : 0
    },
  },
}
