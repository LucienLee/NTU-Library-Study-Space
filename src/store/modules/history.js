// import _ from 'lodash'
import gql from 'graphql-tag'
import apolloClient from '../../apolloClient'
import { mapStatusToState } from '../../utils/seat-status'

const queryStudentHistory = gql`
query StudentHistory($student_id: String!){
	student(student_id: $student_id) {
		last_used {
			seat_id
			status
		}
		most_used {
			seat_id
			status
		}
	}
}
`

const initialStateFactory = () => ({
	show: false,
	lastUsed: [],
	mostUsed: [],
})

// mutations
const mutations = {
	SET_SHOW (state, val) {
		state.show = val
	},
	SET_HISTORY (state, { lastUsed, mostUsed }) {
		state.lastUsed = lastUsed
		state.mostUsed = mostUsed
	},
	RESET_HISTORY (state) {
		const is = initialStateFactory()
		state.show = is.show
		state.lastUsed = is.lastUsed
		state.mostUsed = is.mostUsed
	},
}

const actions = {
	getHistory({ commit }, { user_id }) {
		apolloClient.query({
			query: queryStudentHistory,
			variables: {
				student_id: user_id,
			},
			forceFetch: true,
		}).then(({ data }) => {
			commit('SET_SHOW', true)
			if (!data.student) return

			const mostUsed = data.student.most_used.map(x => ({
				id: x.seat_id,
				state: mapStatusToState(x.status)
			}))
			const lastUsed = [{
				id: data.student.last_used.seat_id,
				state: mapStatusToState(data.student.last_used.status)
			}]

			commit('SET_HISTORY', { mostUsed, lastUsed })
		})
	},
	resetHistory ({ commit, dispatch }) {
		commit('RESET_HISTORY')
		dispatch('blurListItem')
	},
}

const state = initialStateFactory()
export default {
	state,
	mutations,
	actions
}

