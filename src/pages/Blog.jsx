import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
  TOGGLE_LIKE,
} from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

// Fallback method to decode JWT payload without external dependencies
function decodeJwtPayload(token) {
  try {
    const payloadBase64 = token.split('.')[1]
    const payloadJson = atob(payloadBase64)
    return JSON.parse(payloadJson)
  } catch (e) {
    console.warn('Failed to decode JWT payload:', e)
    return null
  }
}

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useQuery(author ? GET_POSTS_BY_AUTHOR : GET_POSTS, {
    variables: { options: { sortBy, sortOrder } },
    fetchPolicy: 'network-only',
  })
  const posts = postsQuery.data?.postsByAuthor ?? postsQuery.data?.posts ?? []

  const { token } = useAuth()
  let currentUsername = ''
  if (token) {
    const decoded = decodeJwtPayload(token)
    currentUsername = decoded?.username ?? ''
  }

  const [toggleLike, { loading: toggleLikeLoading }] = useMutation(
    TOGGLE_LIKE,
    {
      onError(error) {
        console.error('Toggle like mutation error:', error)
      },
      refetchQueries: [
        { query: GET_POSTS, variables: { options: { sortBy, sortOrder } } },
        ...(author
          ? [
              {
                query: GET_POSTS_BY_AUTHOR,
                variables: { author, options: { sortBy, sortOrder } },
              },
            ]
          : []),
      ],
      awaitRefetchQueries: true,
    },
  )

  function handleToggleLike(postId) {
    toggleLike({ variables: { postId } })
  }

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Full-Stack React Recipes</title>
        <meta
          name='description'
          content='A blog full of recipes about full-stack React development.'
        />
      </Helmet>
      <Header />
      <br />
      <hr />
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt', 'likes']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList
        posts={posts}
        currentUsername={currentUsername}
        author={author}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onToggleLike={handleToggleLike}
        loading={toggleLikeLoading}
      />
    </div>
  )
}
