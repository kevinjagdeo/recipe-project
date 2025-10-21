import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthContextProvider } from './contexts/AuthContext.jsx'

// Only export the UI or routes without any Router component here

export function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthContextProvider>
        {/* Render children or routes here directly */}
        <div>Routes go here or render logic in entry points</div>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
