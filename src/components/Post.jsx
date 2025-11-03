import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { useMutation } from '@apollo/client'
import { LIKE_POST } from '../api/graphql/posts.js'

export function Post({
  title,
  content,
  author,
  id,
  imageUrl,
  fullPost = false,
  likes = [],
  likesCount = 0,
  currentUserId,
}) {
  const [showImage, setShowImage] = useState(false)
  const [likePost] = useMutation(LIKE_POST)

  const handleLike = () => {
    likePost({
      variables: { postId: id },
      update(cache, { data: { likePost } }) {
        cache.modify({
          id: cache.identify({ id, __typename: 'Post' }),
          fields: {
            likesCount() {
              return likePost.likesCount
            },
            likes() {
              return likePost.likes
            },
          },
        })
      },
    })
  }

  const hasLiked = likes.some((user) => user.id === currentUserId)

  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      {imageUrl && (
        <div>
          {' '}
          <br />
          <button
            onClick={() => setShowImage((prev) => !prev)}
            style={{ marginBottom: '8px' }}
          >
            {showImage ? 'Hide Image' : 'Show Image'}
          </button>
          {showImage && (
            <img src={imageUrl} alt={title} className='recipe-image' />
          )}
        </div>
      )}
      {fullPost && <div>{content}</div>}
      {author && (
        <em>
          {fullPost && <br />}
          Submitted by <User {...author} />
        </em>
      )}
      <p>Likes: {likesCount}</p>
      <button onClick={handleLike}>{hasLiked ? 'Unlike' : 'Like'}</button>
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  fullPost: PropTypes.bool,
  likes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string,
    }),
  ),
  likesCount: PropTypes.number,
  currentUserId: PropTypes.string.isRequired,
}
