import { useMemo } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider, useAuth } from './contexts/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import PropTypes from 'prop-types'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const queryClient = new QueryClient()

// ApolloProvider wrapper that injects auth token from context dynamically
function ApolloProviderWithAuth({ children }) {
  const { token } = useAuth()

  const httpLink = useMemo(
    () =>
      createHttpLink({
        uri: import.meta.env.VITE_GRAPHQL_URL,
      }),
    [],
  )

  const authLink = useMemo(
    () =>
      setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      })),
    [token],
  )

  const client = useMemo(
    () =>
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      }),
    [authLink, httpLink],
  )

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

ApolloProviderWithAuth.propTypes = {
  children: PropTypes.node.isRequired,
}

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
