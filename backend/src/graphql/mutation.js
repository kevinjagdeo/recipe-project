import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost, addLikeToPost } from '../services/posts.js' // make sure addLikeToPost exists in posts service

export const mutationSchema = `#graphql
type Mutation {
  signupUser(username: String!, password: String!): User
  loginUser(username: String!, password: String!): String
  createPost(title: String!, contents: String, tags:[String]): Post
  likePost(postId: ID!, username: String!): Post
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
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      return await createPost(auth.sub, { title, contents, tags })
    },
    likePost: async (parent, { postId, username }, { auth }) => {
      // Optional: Check if user is authenticated and username matches auth
      if (!auth || auth.username !== username) {
        throw new GraphQLError(
          'You need to be authenticated as this user to like a post.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      // Call service to add like and return updated post
      return await addLikeToPost(postId, username)
    },
  },
}
