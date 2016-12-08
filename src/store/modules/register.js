import 'whatwg-fetch'
import _ from 'lodash'

const url = 'http://140.112.113.35:8080/StudyRoom/api/'

const initialStateFactory = () => ({
	inputFields: {
		seatIDValue: '',
		userIDValue: '',
	},
	loading: false,
	result: {},
	error: {},
	user: {
		id: '',
		isValid: false,
		token: null,
		seatIDOld: null,
		error: {},
	},
})

function errorFactory({ message, message_en }) {
	return {
		message: message || message_en,
		message_en,
	}
}

const getters = {
	doneRequest: state => {
		return !_.isEmpty(state.result) || !_.isEmpty(state.error)
	},
}

// mutations
const mutations = {
	UPDATE_REGISTER_INPUT_VALUE (state, { key, value }) {
		state.inputFields[key] = value
	},
	REGISTER_LOADING (state, val) {
		state.loading = val
	},
	REGISTER_ERROR (state, val) {
		state.error = errorFactory(val)
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
		state.user.error = errorFactory(val)
	},
}

const actions = {
	updateRegisterInputValue ({ commit }, { key, value }) {
		commit('UPDATE_REGISTER_INPUT_VALUE', { key, value })
	},
	checkUser ({ commit, dispatch }, { user_id }) {
		if (!user_id) throw new Error(`user_id: "${user_id}" empty`)

		fetch(`${url}checkUser?user_id=${user_id}`)
			.then(res => res.json())
			.then(json => {
				if (json.authority) {
					// valid
					commit('USER_CHECKED', {
						id: user_id,
						isValid: true,
						token: json.token,
						seatIDOld: json.seat_id || null,
						error: null,
					})

					// because valid, dispatch getHistory action
					dispatch('getHistory', { user_id })
				} else {
					// Failed because of register rejected
					commit('USER_CHECKED', {
						id: user_id,
						isValid: false,
						token: null,
						seatIDOld: null,
						error: json,
					})
				}
			})
			.catch(err => {
				commit('CHECK_USER_ERROR', err)
			})

	},
	checkIn ({ commit, state }, { user_id, seat_id }) {
		if ( !user_id || !seat_id ) throw new Error(`user_id: "${user_id}" or seat_id: "${seat_id}" empty`)

		// start the loading flag
		commit('REGISTER_LOADING', true)

		let token = null
		new Promise((resolve) => {
			// first check if there is already a token to use
			if (state.user.id === user_id && state.user.isValid && state.user.token) {
				// erase the token
				token = state.user.token
				commit('CONSUME_TOKEN')
				resolve()
			} else {
				// no token, so get one first
				return fetch(`${url}checkUser?user_id=${user_id}`)
					.then(res => res.json())
					.then(json => {
						// Failed because of not a valid user
						if (!json.authority) throw json

						// valid user
						token = json.token
					})
			}
		})
			.then(() => {
				// second check if there's seat_id_old
				const seat_id_old = state.user.seatIDOld ? `&seat_id_old=${state.user.seatIDOld}` : ''
				const type = seat_id_old ? '&type=2' : '&type=1'

				// finally send out the request
				return fetch(`${url}checkin?user_id=${user_id}&seat_id=${seat_id}&token=${token}${type}${seat_id_old}`)
			})
			.then(res => res.json())
			.then(json => {
				// Failed because of register rejected
				if (json.affected !== '1') throw json

				// ok
				commit('REGISTER_LOADING', false)
				commit('REGISTER_DONE', json)
			})
			.catch(err => {
				commit('REGISTER_LOADING', false)
				commit('REGISTER_ERROR', err)
			})
	},
	checkOut ({ commit, state }, { user_id }) {
		if (!user_id) throw new Error(`user_id: "${user_id}" empty`)

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
					// Failed because of register rejected
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
					// Failed because of not a valid user
					if (!json.authority) throw json

					// valid
					return fetch(`${url}checkout?user_id=${user_id}&token=${json.token}`)
				})
				.then(res => res.json())
				.then(json => {
					// Failed because of register rejected
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
	resetRegister ({ commit, dispatch }) {
		commit('RESET_REGISTER')

		// since every time reset register is followed by reset history, let's
		// call it here for simplicity
		dispatch('resetHistory')

		// zoom the map back to initial state
		dispatch('setResetMapToInitState', true)

		// clear filter options
		dispatch('clearFilter')
	}
}

const state = initialStateFactory()
export default {
	state,
	getters,
	mutations,
	actions
}

