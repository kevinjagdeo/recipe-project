import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { NotificationPopup } from '../components/NotificationPopup.jsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'
import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/SocketIOContext.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const [notification, setNotification] = useState(null)
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })

  const posts = postsQuery.data ?? []

  useEffect(() => {
    if (socket) {
      const handleNewRecipe = (data) => {
        setNotification(data)
        // Refresh the posts list to show the new post
        queryClient.invalidateQueries(['posts'])
      }

      socket.on('new.recipe.posted', handleNewRecipe)

      return () => {
        socket.off('new.recipe.posted', handleNewRecipe)
      }
    }
  }, [socket, queryClient])

  return (
    <div style={{ padding: 8 }}>
      <NotificationPopup
        notification={notification}
        onClose={() => setNotification(null)}
      />
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
      <PostList posts={posts} />
    </div>
  )
}
