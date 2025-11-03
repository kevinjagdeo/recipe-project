import { gql } from '@apollo/client/core/index.js'
export const GET_POSTS = gql`
  query getPosts {
    posts {
      author {
        username
      }

      id
      title
      content
      tags
      updatedAt
      createdAt
    }
  }
`
