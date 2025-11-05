import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import slug from 'slug'
import { TOGGLE_LIKE } from '../api/graphql/posts' // Your GraphQL mutation

export function Post({
  title,
  content,
  author,
  id,
  imageUrl,
  fullPost = false,
  currentUsername,
  likes,
  likedBy = [], // array of usernames who liked
}) {
  const [showImage, setShowImage] = useState(false)

  const isLiked = likedBy.includes(currentUsername)

  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id },
    optimisticResponse: {
      toggleLike: {
        id,
        likes: isLiked ? likes - 1 : likes + 1,
        likedBy: isLiked
          ? likedBy.filter((user) => user !== currentUsername)
          : [...likedBy, currentUsername],
        __typename: 'Post',
      },
    },
  })

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
      {/* Like button */}
      <div>
        <button onClick={() => toggleLike()} disabled={false}>
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
  likes: PropTypes.number, // total likes (updated field)
  likedBy: PropTypes.arrayOf(PropTypes.string), // array of usernames
}
