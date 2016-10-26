// import * as types from '../mutation-types'
import 'whatwg-fetch'

const url = 'http://140.112.113.35:8080/StudyRoom/api/'

const initialStateFactory = () => ({
	loading: false,
	error: {},
	result: {},
})

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
	}
}

const actions = {
	checkIn ({ commit }, { user_id, seat_id }) {
		if (!user_id || !seat_id) throw `user_id: "${user_id}" or seat_id: "${seat_id}" empty`
		commit('REGISTER_LOADING', true)
		fetch(`${url}checkUser?user_id=${user_id}`)
			.then(res => res.json())
			.then(json => {
				// not valid
				if (!json.authority) throw `${json.message} / ${json.message_en}`

				// valid
				return fetch(`${url}checkin?type=1&user_id=${user_id}&seat_id=${seat_id}&token=${json.token}`)
			})
			.then(res => res.json())
			.then(json => {
				// not valid
				if (json.affected === '0') throw json

				// valid
				commit('REGISTER_LOADING', false)
				commit('REGISTER_DONE', json)
			})
			.catch(err => {
				console.error(err)
				commit('REGISTER_LOADING', false)
				commit('REGISTER_ERROR', err)
			})
	},
	checkOut ({ commit }, { user_id }) {
		if (!user_id) throw `user_id: "${user_id}" empty`
		commit('REGISTER_LOADING', true)
		fetch(`${url}checkUser?user_id=${user_id}`)
			.then(res => res.json())
			.then(json => {
				// not valid
				if (!json.authority) throw `${json.message} / ${json.message_en}`

				// valid
				return fetch(`${url}checkout?user_id=${user_id}&token=${json.token}`)
			})
			.then(res => res.json())
			.then(json => {
				// not valid
				if (json.affected === '0') throw json

				// valid
				commit('REGISTER_LOADING', false)
				commit('REGISTER_DONE', json)
			})
			.catch(err => {
				console.error(err)
				commit('REGISTER_LOADING', false)
				commit('REGISTER_ERROR', err)
			})
	},
	resetRegister ({ commit }) {
		commit('RESET_REGISTER')
	},
}
window.store = require('../index.js')

const state = initialStateFactory()
export default {
	state,
	mutations,
	actions,
}

