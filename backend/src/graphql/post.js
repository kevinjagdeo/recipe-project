import { getUserInfoById } from '../services/users.js'
import { User } from '../db/models/user.js'

export const postSchema = `#graphql
  type Post {
    id: ID!
    title: String!
    author: User
    content: String
    tags: [String!]
    createdAt: Float
    updatedAt: Float
    likes: Int!
    likedBy: [String!]!  # Add this if you want to expose who liked (usernames)
  }
`

export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author)
    },
    likes: (post) => {
      if ('likesCount' in post) {
        return post.likesCount
      }
      if ('likedBy' in post) {
        return post.likedBy.length
      }
      return 0
    },
    likedBy: async (post) => {
      if ('likedBy' in post) {
        // Fetch usernames for user IDs in likedBy array
        const users = await User.find({ _id: { $in: post.likedBy } })
        return users.map((user) => user.username)
      }
      return []
    },
  },
}
