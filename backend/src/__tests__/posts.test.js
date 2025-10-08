import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let testUser = null
let samplePosts = []

beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  samplePosts = [
    {
      title: 'Learning Redux',
      author: testUser._id,
      imageUrl:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
      tags: ['redux'],
    },
    {
      title: 'Learn React Hooks',
      author: testUser._id,
      imageUrl:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
      tags: ['react'],
    },
    {
      title: 'Full-Stack React Projects',
      author: testUser._id,
      imageUrl:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
      tags: ['react', 'nodejs'],
    },
  ]
})

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})
describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      content: 'some content',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.content).toEqual('some content')
  })
  test('should not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      content: 'new content',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.content).toEqual('new content')
  })
  test('should update the updatedAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      content: 'new content',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      content: 'Test Author',
    })
    expect(post).toEqual(null)
  })
})
describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })
  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor(testUser.username)
    expect(posts.length).toBe(3)
  })
  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Learning Redux',

      imageUrl:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
      tags: ['redux'],
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundPost = await Post.findById(createdPost._id)

    expect(foundPost).not.toBeNull()
    expect(foundPost.title).toBe(post.title)

    expect(foundPost.content).toBe(post.content)
    expect(foundPost.imageUrl).toBe(post.imageUrl)
    expect(foundPost.tags).toEqual(expect.arrayContaining(post.tags))

    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const post = {
      content: 'Post with no title',
      imageUrl:
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
      tags: ['empty'],
    }
    try {
      await createPost(testUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Title and image',
      imageUrl:
        'https://ucarecdn.com/5cde3dd6-8621-410c-87ff-7af992ed8fa2/-/crop/2181x2948/455,0/-/preview/-/scale_crop/350x473/-/quality/smart/-/format/auto/',
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
