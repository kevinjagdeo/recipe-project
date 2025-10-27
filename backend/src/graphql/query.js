export const querySchema = `#graphql
type Query {
test: String
}
`
export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello World from GraphQL!'
    },
  },
}
