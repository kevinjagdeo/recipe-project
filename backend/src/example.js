import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'

import dotenv from 'dotenv'
dotenv.config()

await initDatabase()
const post = new Post({
  title: 'Hello Second Post!',
  author: 'Jessica Liu',
  content: 'This is a new post.',
  imageUrl:
    'https://ucarecdn.com/5cde3dd6-8621-410c-87ff-7af992ed8fa2/-/crop/2181x2948/455,0/-/preview/-/scale_crop/350x473/-/quality/smart/-/format/auto/',
  tags: ['frontend', 'mongodb'],
})
await post.save()
const posts = await Post.find()
console.log(posts)
