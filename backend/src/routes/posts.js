import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'
import { getUserInfoById } from '../services/users.js'
export function postsRoutes(app, io) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('error listing posts', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('error getting post', err)
      return res.status(500).end()
    }
  })
  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)
      // Emit socket event to all connected users about the new post
      if (io) {
        const authorInfo = await getUserInfoById(req.auth.sub)
        io.emit('new.recipe.posted', {
          postId: post._id,
          title: post.title,
          author: authorInfo.username,
          createdAt: post.createdAt,
        })
      }
      return res.json(post)
    } catch (err) {
      console.error('error creating post', err)
      return res.status(500).end()
    }
  })
  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('error updating post', err)
      return res.status(500).end()
    }
  })
  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting post', err)
      return res.status(500).end()
    }
  })
}
