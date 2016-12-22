import ApolloClient, { createNetworkInterface } from 'apollo-client'

// `GRAPHQL_URL_ROOT` is set by webpack's DefinePlugin
const uri = process.env.GRAPHQL_URL_ROOT + '/graphql'

// Create the apollo client
const apolloClient = new ApolloClient({
	networkInterface: createNetworkInterface({
		uri,
		transportBatching: true,
	}),
	// queryTransformer: addTypename,
})

export default apolloClient
