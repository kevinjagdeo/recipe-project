import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const queryClient = new QueryClient()
const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

export function App({ children }) {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
