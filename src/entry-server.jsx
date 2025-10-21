import { renderToString } from 'react-dom/server'
import { RouterProvider, createMemoryRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from '@tanstack/react-query'
import { App } from './App.jsx'
import { routes } from './routes.jsx'

export async function render(url) {
  const queryClient = new QueryClient()
  const helmetContext = {}

  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  })

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </QueryClientProvider>
      ,
    </HelmetProvider>,
  )

  const dehydratedState = dehydrate(queryClient)

  return { appHtml, dehydratedState, helmetContext }
}
