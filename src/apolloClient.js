import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'

// Create the apollo client
const apolloClient = new ApolloClient({
	networkInterface: createNetworkInterface({
		uri: 'http://localhost:3000/graphql',
		transportBatching: true,
	}),
	queryTransformer: addTypename,
})

export default apolloClient
