import { renderToString } from 'react-dom/server'
import { RouterProvider, createMemoryRouter } from 'react-router-dom/server'
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from '@tanstack/react-query'
import { App } from './App.jsx'
import { routes } from './routes.jsx'

export async function render(url) {
  const queryClient = new QueryClient()

  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  })

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </QueryClientProvider>,
  )

  const dehydratedState = dehydrate(queryClient)

  return { appHtml, dehydratedState }
}
