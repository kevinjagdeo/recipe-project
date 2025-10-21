import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query'
import { App } from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes.jsx'

const router = createBrowserRouter(routes)

const queryClient = new QueryClient()
const dehydratedState = window.__REACT_QUERY_STATE__

hydrateRoot(
  document.getElementById('root'),
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      <App>
        <RouterProvider router={router} />
      </App>
    </HydrationBoundary>
  </QueryClientProvider>,
)
