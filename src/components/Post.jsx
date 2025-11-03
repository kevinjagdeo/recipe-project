import { useState } from 'react'
import { PropTypes } from 'prop-types'
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
}) {
  const [showImage, setShowImage] = useState(false)

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
          Submitted by <User id={author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.string,
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  fullPost: PropTypes.bool,
}
