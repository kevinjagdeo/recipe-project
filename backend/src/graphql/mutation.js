import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost, toggleLikePost } from '../services/posts.js' // use toggleLikePost service

export const mutationSchema = `#graphql
  type Mutation {
    signupUser(username: String!, password: String!): User
    loginUser(username: String!, password: String!): String
    createPost(title: String!, contents: String, tags:[String]): Post
    toggleLike(postId: ID!): Post
  }
`

export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },
    createPost: async (parent, { title, contents, tags }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: { code: 'UNAUTHORIZED' },
          },
        )
      }
      return await createPost(auth.sub, { title, contents, tags })
    },
    toggleLike: async (parent, { postId }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: { code: 'UNAUTHORIZED' },
          },
        )
      }
      return await toggleLikePost(postId, auth.sub)
    },
  },
}
