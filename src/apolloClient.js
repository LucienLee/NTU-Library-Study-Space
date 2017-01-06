import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { historyURL } from 'credential'

const uri = historyURL + '/graphql'

// Create the apollo client
const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri,
    transportBatching: true
  })
  // queryTransformer: addTypename,
})

export default apolloClient
