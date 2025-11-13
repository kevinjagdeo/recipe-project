import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { User } from './User.jsx'

export function Post({ title, content, author, imageUrl }) {
  const [showImage, setShowImage] = useState(false)

  return (
    <article className='recipe-post'>
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
      <h3>{title}</h3>
      <div>{content}</div>
      {author && (
        <em>
          <br />
          Created by <User id={author} />
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
}
