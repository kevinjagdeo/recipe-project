import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export function PostList({
  posts = [],
  currentUsername,
  onToggleLike,
  loading,
}) {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post.id}>
          <Post
            {...post}
            currentUsername={currentUsername}
            onToggleLike={onToggleLike}
            loading={loading}
          />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUsername: PropTypes.string.isRequired, // Added
  onToggleLike: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}
