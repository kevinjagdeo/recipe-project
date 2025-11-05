import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { ApolloProviderWithAuth } from './contexts/ApolloProviderWithAuth.jsx'

const queryClient = new QueryClient()

export function App({ children }) {
  return (
    <HelmetProvider>
      <AuthContextProvider>
        <ApolloProviderWithAuth>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ApolloProviderWithAuth>
      </AuthContextProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
