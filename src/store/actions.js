import gql from 'graphql-tag'
import apolloClient from '../apolloClient'

export function updateSeats ({ commit }, val) {
	commit('UPDATE_SEATS', val)
}

export function startSeatQuery ({ dispatch }) {
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
}

export function setResetMapToInitState ({ commit }, val) {
	commit('SET_RESET_MAP_TO_INIT_STATE', val)
}
