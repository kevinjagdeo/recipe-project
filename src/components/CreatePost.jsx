//import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useState } from 'react'
//import { createPost } from '../api/posts.js'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function CreatePost() {
  const [title, setTitle] = useState('')

  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [token] = useAuth()

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, content },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  /*const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, content: content, imageUrl }),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })*/

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
    //createPostMutation.mutate()
  }
  if (!token) return <div>Please log in to create new posts.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />

      <div>
        <label htmlFor='create-content'>Ingredients: </label>
        <textarea
          id='create-content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-image-url'>Image URL: </label>
        <input
          type='text'
          name='create-image-url'
          id='create-image-url'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createPost && (
        <>
          <br />
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            {data.createPost.title}
          </Link>{' '}
          created successfully!
        </>
      )}
    </form>
  )
}
