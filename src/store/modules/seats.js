import gql from 'graphql-tag'
import apolloClient from '../../apolloClient'

const state = {
}

const mutations = {
}

const actions = {
	startSeatQuery ({ dispatch }) {
		apolloClient.watchQuery({
			query: gql`
				{
					seatInfo
				}
			`,
			pollInterval: 300, // ms
		}).subscribe({
			next ({ data }) {
				dispatch('updateSeats', JSON.parse(data.seatInfo))
			},
			error (err) {
				console.error(err) // eslint-disable-line no-console
			}
		})
	},
}

export default {
	state,
	mutations,
	actions,
}

