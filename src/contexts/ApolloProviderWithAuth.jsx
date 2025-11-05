//import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAuth } from './AuthContext.jsx'
import PropTypes from 'prop-types'

export function ApolloProviderWithAuth({ children }) {
  const { token } = useAuth()

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

ApolloProviderWithAuth.propTypes = {
  children: PropTypes.node.isRequired,
}
