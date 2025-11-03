import { listPostsByAuthor } from '../services/posts.js'

export const userSchema = `#graphql
type User {
  id: ID!              # Add this line
  username: String!
  posts: [Post!]!
}
`

export const userResolver = {
  User: {
    posts: async (user) => {
      return await listPostsByAuthor(user.username)
    },
  },
}
