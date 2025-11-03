import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost } from '../services/posts.js'

export const mutationSchema = `#graphql
type Mutation {
  signupUser(username: String!, password: String!): User
  loginUser(username: String!, password: String!): String
  createPost(title: String!, contents: String, tags: [String]): Post
  likePost(postId: ID!): Post       # New mutation for liking/unliking a post
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

    likePost: async (parent, { postId }, { auth, models }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: { code: 'UNAUTHORIZED' },
          },
        )
      }

      const post = await models.Post.findById(postId)
      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      const userId = auth.sub

      const likedIndex = post.likes.findIndex((id) => id.toString() === userId)

      if (likedIndex === -1) {
        post.likes.push(userId)
      } else {
        post.likes.splice(likedIndex, 1)
      }

      await post.save()
      return post
    },
  },
}
