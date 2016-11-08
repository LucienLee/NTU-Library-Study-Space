import 'whatwg-fetch'
import _ from 'lodash'

const url = 'http://140.112.113.35:8080/StudyRoom/api/'

const initialStateFactory = () => ({
	loading: false,
	result: {},
	error: null,
	user: {
		id: '',
		isValid: false,
		token: null,
		error: null,
	},
})

const getters = {
	doneRequest: state => {
		return !_.isEmpty(state.result) || state.error
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
	CHECK_USER_ERROR (state, val) {
		state.user.error = val
	},
}

const actions = {
	checkUser({ commit, dispatch }, { user_id }) {
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

					// because valid, dispatch getHistory action
					dispatch('getHistory', { user_id })
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
			.catch(err => {
				commit('CHECK_USER_ERROR', err.toString())
			})

	},
	checkIn ({ commit, state }, { user_id, seat_id }) {
		if ( !user_id || !seat_id ) throw `user_id: "${user_id}" or seat_id: "${seat_id}" empty`

		// start the loading flag
		commit('REGISTER_LOADING', true)

		// first check if there is already a token to use
		if (state.user.id === user_id && state.user.isValid && state.user.token) {
			// erase the token
			const token = state.user.token
			commit('CONSUME_TOKEN')

			// send out the request
			fetch(`${url}checkin?type=1&user_id=${user_id}&seat_id=${seat_id}&token=${token}`)
				.then(res => res.json())
				.then(json => {
					// nothing affected
					if (json.affected !== '1') throw `${json.message} / ${json.message_en}`

					// ok
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err.toString())
				})
		} else {
			// no token, so get one first
			fetch(`${url}checkUser?user_id=${user_id}`)
				.then(res => res.json())
				.then(json => {
					// not a valid user
					if (!json.authority) throw json.message

					// valid user
					return fetch(`${url}checkin?type=1&user_id=${user_id}&seat_id=${seat_id}&token=${json.token}`)
				})
				.then(res => res.json())
				.then(json => {
					// nothing affected
					if (json.affected !== '1') throw `${json.message} / ${json.message_en}`

					// ok
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err.toString())
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
			const token = state.user.token
			commit('CONSUME_TOKEN')

			// send out the request
			fetch(`${url}checkout?user_id=${user_id}&token=${token}`)
				.then(res => res.json())
				.then(json => {
					// not valid
					if (json.affected !== '1') throw `${json.message} / ${json.message_en}`

					// valid
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err.toString())
				})
		} else {
			// no token, so get one first
			fetch(`${url}checkUser?user_id=${user_id}`)
				.then(res => res.json())
				.then(json => {
					// not valid
					if (!json.authority) throw json.message

					// valid
					return fetch(`${url}checkout?user_id=${user_id}&token=${json.token}`)
				})
				.then(res => res.json())
				.then(json => {
					// not valid
					if (json.affected !== '1') throw `${json.message} / ${json.message_en}`

					// valid
					commit('REGISTER_LOADING', false)
					commit('REGISTER_DONE', json)
				})
				.catch(err => {
					commit('REGISTER_LOADING', false)
					commit('REGISTER_ERROR', err.toString())
				})
		}
	},
	resetRegister ({ commit, dispatch }) {
		commit('RESET_REGISTER')

		// since every time reset register is followed by reset history, let's
		// call it here for simplicity
		dispatch('resetHistory')
	},
}

const state = initialStateFactory()
export default {
	state,
	getters,
	mutations,
	actions
}

