import { getUserInfoById } from '../services/users.js'

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
      // Return the count of likes; post.likesCount or length of likedBy
      // Assuming post.likesCount field exists
      if ('likesCount' in post) {
        return post.likesCount
      }
      // Or use length of likedBy array if available
      if ('likedBy' in post) {
        return post.likedBy.length
      }
      return 0
    },
    likedBy: (post) => {
      // Return array of usernames who liked the post, if available
      if ('likedBy' in post) {
        // You might want to resolve IDs to usernames here with DB call if needed
        return post.likedBy
      }
      return []
    },
  },
}
