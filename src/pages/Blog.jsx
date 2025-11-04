import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery as useGraphQLQuery } from '@apollo/client/react'
import { GET_POSTS, GET_POSTS_BY_AUTHOR } from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import * as jwtDecode from 'jwt-decode'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useGraphQLQuery(author ? GET_POSTS_BY_AUTHOR : GET_POSTS, {
    variables: { options: { sortBy, sortOrder } },
  })
  const posts = postsQuery.data?.postsByAuthor ?? postsQuery.data?.posts ?? []

  const { token } = useAuth()
  let currentUsername = ''
  if (token) {
    try {
      const decoded = jwtDecode(token)
      currentUsername = decoded.username
    } catch (e) {
      console.warn('JWT decode failed:', e)
    }
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
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} currentUsername={currentUsername} />
    </div>
  )
}
