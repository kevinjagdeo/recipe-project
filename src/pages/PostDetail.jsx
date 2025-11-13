import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPostById } from '../api/posts.js'
import { Post } from '../components/Post.jsx'
import { Header } from '../components/Header.jsx'

export function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const postQuery = useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id),
  })

  if (postQuery.isLoading) {
    return (
      <div style={{ padding: 8 }}>
        <Header />
        <br />
        <div>Loading post...</div>
      </div>
    )
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <div style={{ padding: 8 }}>
        <Header />
        <br />
        <div>Post not found</div>
        <button onClick={() => navigate('/')}>Back to Blog</button>
      </div>
    )
  }

  const post = postQuery.data

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <button onClick={() => navigate('/')}>← Back to Blog</button>
      <br />
      <br />
      <Post {...post} />
    </div>
  )
}
