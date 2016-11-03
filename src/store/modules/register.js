import 'whatwg-fetch'
import _ from 'lodash'

const url = 'http://140.112.113.35:8080/StudyRoom/api/'

const initialStateFactory = () => ({
	loading: false,
	result: {},
	error: {},
	user: {
		id: '',
		isValid: false,
		token: null,
		error: null,
	},
})

const getters = {
	doneRequest: state => {
		return !_.isEmpty(state.result) || !_.isEmpty(state.error)
	}
}

// mutations
const mutations = {
	REGISTER_LOADING (state, val) {
		state.loading = val
	},
	REGISTER_ERROR (state, val) {
		state.error = val
	},
	REGISTER_DONE (state, val) {
		state.result = val
	},
	RESET_REGISTER (state) {
		const is = initialStateFactory()
		state.loading = is.loading
		state.error = is.error
		state.result = is.result
		state.user = is.user
	},
	USER_CHECKED (state, val) {
		state.user = Object.assign(state.user, val)
	},
	CONSUME_TOKEN (state) {
		state.user.token = null
	},
}

const actions = {
	checkUser({ commit }, { user_id }) {
		if (!user_id) throw `user_id: "${user_id}" empty`

		fetch(`${url}checkUser?user_id=${user_id}`)
			.then(res => res.json())
			.then(json => {
				if (json.authority) {
					// valid
					commit('USER_CHECKED', {
						id: user_id,
						isValid: true,
						token: json.token,
						error: null,
					})
				} else {
					// not valid
					commit('USER_CHECKED', {
						id: user_id,
						isValid: false,
						token: null,
						error: json.message,
					})
				}
			})

	},
	checkIn ({ commit, state }, { user_id, seat_id }) {
		if ( !user_id || !seat_id ) throw `user_id: "${user_id}" or seat_id: "${seat_id}" empty`

		// start the loading flag
		commit('REGISTER_LOADING', true)

		// first check if there is already a token to use
		if (state.user.id === user_id && state.user.isValid && state.user.token) {
			// erase the token
			commit('CONSUME_TOKEN')

			// send out the request
			fetch(`${url}checkin?type=1&user_id=${user_id}&seat_id=${seat_id}&token=${state.user.token}`)
				.then(res => res.json())
				.then(json => {
					// nothing affected
					if (json.affected !== '1') throw json

					// ok
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err)
				})
		} else {
			// no token, so get one first
			fetch(`${url}checkUser?user_id=${user_id}`)
				.then(res => res.json())
				.then(json => {
					// not a valid user
					if (!json.authority) throw _.omit(json, ['authority'])

					// valid user
					return fetch(`${url}checkin?type=1&user_id=${user_id}&seat_id=${seat_id}&token=${json.token}`)
				})
				.then(res => res.json())
				.then(json => {
					// nothing affected
					if (json.affected !== '1') throw json

					// ok
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err)
				})
		}
	},
	checkOut ({ commit, state }, { user_id }) {
		if (!user_id) throw `user_id: "${user_id}" empty`

		// set loading flag
		commit('REGISTER_LOADING', true)

		// first check if there is already a token to use
		if (state.user.id === user_id && state.user.isValid && state.user.token) {
			// erase the token
			commit('CONSUME_TOKEN')

			// send out the request
			fetch(`${url}checkout?user_id=${user_id}&token=${state.user.token}`)
				.then(res => res.json())
				.then(json => {
					// not valid
					if (json.affected !== '1') throw json

					// valid
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err)
				})
		} else {
			// no token, so get one first
			fetch(`${url}checkUser?user_id=${user_id}`)
				.then(res => res.json())
				.then(json => {
					// not valid
					if (!json.authority) throw _.omit(json, ['authority'])

					// valid
					return fetch(`${url}checkout?user_id=${user_id}&token=${json.token}`)
				})
				.then(res => res.json())
				.then(json => {
					// not valid
					if (json.affected !== '1') throw json

					// valid
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err)
				})
		}
	},
	resetRegister ({ commit }) {
		commit('RESET_REGISTER')
	},
}

const state = initialStateFactory()
export default {
	state,
	getters,
	mutations,
	actions
}

