import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export function PostList({ posts = [], currentUsername }) {
  return (
    <div>
      {posts.map((post) => (
        <Fragment key={post._id}>
          <Post {...post} currentUsername={currentUsername} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
  currentUsername: PropTypes.string.isRequired,
}
