import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export function PostList({ posts = [], currentUserId }) {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post.id}>
          {/* currentUserId is explicitly passed here, so it's "used" */}
          <Post {...post} currentUserId={currentUserId} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

// Exclude `currentUserId` from Post propTypes when defining posts shape
const { currentUserId, ...postShapeWithoutCurrentUserId } = Post.propTypes || {}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(postShapeWithoutCurrentUserId))
    .isRequired,
  currentUserId: PropTypes.string.isRequired,
}
