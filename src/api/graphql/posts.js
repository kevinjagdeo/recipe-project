import { gql } from '@apollo/client/core/index.js'

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    content
    tags
    updatedAt
    createdAt
    author {
      username
    }
    likesCount # Add the total likes count
    likes {
      id
      username # Add users who liked (optional, for showing avatars/names)
    }
  }
`

export const GET_POSTS = gql`
  ${POST_FIELDS}
  query getPosts($options: PostsOptions) {
    posts(options: $options) {
      ...PostFields
    }
  }
`

export const GET_POSTS_BY_AUTHOR = gql`
  ${POST_FIELDS}
  query getPostsByAuthor($author: String!, $options: PostsOptions) {
    postsByAuthor(username: $author, options: $options) {
      ...PostFields
    }
  }
`

export const CREATE_POST = gql`
  mutation createPost($title: String!, $contents: String, $tags: [String!]) {
    createPost(title: $title, contents: $contents, tags: $tags) {
      id
      title
    }
  }
`

export const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likesCount
      likes {
        id
        username
      }
    }
  }
`
