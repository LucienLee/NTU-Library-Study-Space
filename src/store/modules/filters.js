// import * as types from '../mutation-types'

const initialStateFactory = () => ({
	laptop: {
		laptopAllow: false,
		laptopForbidden: false,
	},
	table: {
		seatCount: {
			seats4: false,
			seats6: false,
		},
		partition: false,
	},
	near: {
		wall: false,
		window: false,
	},
	away: {
		vent: false,
		toilet: false,
		register: false,
		aisle: false,
	},
})

// mutations
const mutations = {
	UPDATE_LAPTOP (state, val) {
		state.laptop = val
	},
	UPDATE_TABLE_SEATCOUNT (state, val) {
		state.table.seatCount = val
	},
	UPDATE_TABLE_PARTITION (state, val) {
		state.table.partition = val
	},
	UPDATE_NEAR (state, val) {
		state.near = val
	},
	UPDATE_AWAY_VENT (state, val) {
		state.away.vent = val
	},
	UPDATE_AWAY_TOILET(state, val) {
		state.away.toilet = val
	},
	UPDATE_AWAY_REGISTER (state, val) {
		state.away.register = val
	},
	UPDATE_AWAY_AISLE (state, val) {
		state.away.aisle = val
	},
	CLEAR_FILTER (state) {
		// https://github.com/vuejs/vuex/issues/82
		const is = initialStateFactory()
		state.laptop = is.laptop
		state.away = is.away
		state.near = is.near
		state.table = is.table
	},
}

const actions = {
	updateLaptopAllow({ commit }, val) {
		commit('UPDATE_LAPTOP', { laptopAllow: val, laptopForbidden: false })
	},
	updateLaptopForbidden({ commit }, val) {
		commit('UPDATE_LAPTOP', { laptopAllow: false, laptopForbidden: val })
	},
	updateSeats4({ commit }, val) {
		commit('UPDATE_TABLE_SEATCOUNT', { seats4: val, seats6: false })
	},
	updateSeats6({ commit }, val) {
		commit('UPDATE_TABLE_SEATCOUNT', { seats4: false, seats6: val })
	},
	updatePartition({ commit }, val) {
		commit('UPDATE_TABLE_PARTITION', val)
	},
	updateWall({ commit }, val) {
		commit('UPDATE_NEAR', { wall: val, window: false })
	},
	updateWindow({ commit }, val) {
		commit('UPDATE_NEAR', { wall: false, window: val })
	},
	updateVent({ commit }, val) {
		commit('UPDATE_AWAY_VENT', val)
	},
	updateToilet({ commit }, val) {
		commit('UPDATE_AWAY_TOILET', val)
	},
	updateRegister({ commit }, val) {
		commit('UPDATE_AWAY_REGISTER', val)
	},
	updateAisle({ commit }, val) {
		commit('UPDATE_AWAY_AISLE', val)
	},
	clearFilter({ commit }) {
		commit('CLEAR_FILTER')
	},
}

const state = initialStateFactory()
export default {
	state,
	mutations,
	actions,
}

