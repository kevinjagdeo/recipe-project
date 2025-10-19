import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'

export function Post({
  title,
  content,
  author,
  _id,
  fullPost = false,
  imageUrl,
}) {
  const [showImage, setShowImage] = useState(false)

  return (
    <article className='recipe-post'>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${_id}`}>
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
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.string,
  imageUrl: PropTypes.string,
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
