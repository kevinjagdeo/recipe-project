import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation as useApolloMutation } from '@apollo/client'
import { useMutation as useReactMutation } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { PostStats } from '../components/PostStats.jsx'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { postTrackEvent } from '../api/events.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { GET_POST_BY_ID, TOGGLE_LIKE } from '../api/graphql/posts.js'

export function ViewPost({ postId }) {
  const [session, setSession] = useState()
  const trackEventMutation = useReactMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })

  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [postId])

  const { user } = useAuth()
  const currentUsername = user?.username || ''

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  })

  const post = data?.postById

  const [toggleLike, { loading: toggleLikeLoading }] = useApolloMutation(
    TOGGLE_LIKE,
    {
      onCompleted: () => refetch(),
    },
  )

  function handleToggleLike(id) {
    toggleLike({ variables: { postId: id } })
  }

  function truncate(str, max = 160) {
    if (!str) return ''
    return str.length > max ? str.slice(0, max - 3) + '...' : str
  }

  if (loading) return <p>Loading post...</p>
  if (error) return <p>Error loading post</p>

  return (
    <div style={{ padding: 8 }}>
      {post ? (
        <>
          <Helmet>
            <title>{post.title} | Full-Stack React Recipes</title>
            <meta name='description' content={truncate(post.content)} />
            <meta property='og:type' content='article' />
            <meta property='og:title' content={post.title} />
            <meta
              property='og:article:published_time'
              content={post.createdAt}
            />
            <meta
              property='og:article:modified_time'
              content={post.updatedAt}
            />
            <meta
              property='og:article:author'
              content={post.author?.username}
            />
            {(post.tags ?? []).map((tag) => (
              <meta key={tag} property='og:article:tag' content={tag} />
            ))}
          </Helmet>

          <Header />
          <br />
          <hr />
          <Link to='/'>Back to main page</Link>
          <br />
          <hr />
          <div>
            <Post
              {...post}
              fullPost
              id={postId}
              author={post.author}
              currentUsername={currentUsername}
              likes={post.likes ?? 0}
              likedBy={post.likedBy ?? []}
              onToggleLike={handleToggleLike}
              loading={toggleLikeLoading}
            />
            <hr />
            <PostStats postId={postId} />
          </div>
        </>
      ) : (
        `Post with id ${postId} not found.`
      )}
    </div>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
