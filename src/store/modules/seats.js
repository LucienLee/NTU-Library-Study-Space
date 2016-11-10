// import * as types from '../mutation-types'
import gql from 'graphql-tag'
import apolloClient from '../../apolloClient'

const state = {
}

// mutations
const mutations = {
	// UPDATE_SEATS (state, val) {
	// 	state.laptop = val
	// },
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
				console.error(err)
			}
		})
	},
}

export default {
	state,
	mutations,
	actions,
}

