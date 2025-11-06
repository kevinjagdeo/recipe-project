import { gql } from '@apollo/client'

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    content
    tags
    imageUrl
    updatedAt
    createdAt
    author {
      username
    }
    likes
    likedBy
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
  mutation createPost(
    $title: String!
    $content: String
    $imageUrl: String
    $tags: [String!]
  ) {
    createPost(
      title: $title
      content: $content
      imageUrl: $imageUrl
      tags: $tags
    ) {
      id
      title
    }
  }
`

export const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: ID!) {
    toggleLike(postId: $postId) {
      id
      likes
      likedBy
    }
  }
`

export const GET_POST_BY_ID = gql`
  query getPostById($id: ID!) {
    postById(id: $id) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`
