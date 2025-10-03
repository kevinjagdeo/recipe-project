import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'
await initDatabase()
const post = new Post({
  title: 'Hello Mongoose!',
  contents: 'This post is stored in a MongoDB database using Mongoose.',
  image:
    'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
  tags: ['mongoose', 'mongodb'],
})
await post.save()
const posts = await Post.find()
console.log(posts)
