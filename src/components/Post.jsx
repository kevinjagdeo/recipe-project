import { useState } from 'react'
import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function Post({
  title,
  content,
  author,
  id,
  imageUrl,
  fullPost = false,
  currentUsername = '',
  likes = 0,
  likedBy = [],
  onToggleLike,
  loading,
}) {
  const [showImage, setShowImage] = useState(false)

  const isLiked = likedBy.some((user) => user.username === currentUsername)
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

      <div>
        <button onClick={() => onToggleLike(id)} disabled={loading}>
          {isLiked ? 'Unlike' : 'Like'} ({likes})
        </button>
      </div>
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
  currentUsername: PropTypes.string,
  likes: PropTypes.number,
  likedBy: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  ),
  onToggleLike: PropTypes.func,
  loading: PropTypes.bool,
}
