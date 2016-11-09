import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'

const uri = process.env.DEV_SERVER ? 'http://localhost:3000/graphql' : 'http://140.112.113.10/graphql'

// Create the apollo client
const apolloClient = new ApolloClient({
	networkInterface: createNetworkInterface({
		uri,
		transportBatching: true,
	}),
	queryTransformer: addTypename,
})

export default apolloClient
