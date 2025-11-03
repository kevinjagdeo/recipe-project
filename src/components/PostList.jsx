import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export function PostList({ posts = [], currentUserId }) {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post.id}>
          <Post {...post} currentUserId={currentUserId} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
  currentUserId: PropTypes.string.isRequired,
}
