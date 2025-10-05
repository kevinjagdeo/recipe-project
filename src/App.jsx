import { PostList } from './components/PostList.jsx'

const posts = [
  {
    title: 'Full-Stack React Projects',
    content: "Let's become full-stack developers!",
    author: 'Daniel Bugl',
    imageUrl:
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
  },
  {
    title: 'Hello React!',
    imageUrl:
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700,636',
  },
]

export function App() {
  return <PostList posts={posts} />
}
