// import * as types from '../mutation-types'
import _ from 'lodash'

const dd = require('../../dd.json')

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


const _allseatArray = []
for (let i = 1; i <= 224; ++i) {
	_allseatArray.push(`A${`00${i}`.slice(-3)}`)
}
for (let i = 231; i <= 300; ++i) {
	_allseatArray.push(`A${`00${i}`.slice(-3)}`)
}
for (let i = 1; i <= 180; ++i) {
	_allseatArray.push(`B${`00${i}`.slice(-3)}`)
}
for (let i = 1; i <= 348; ++i) {
	_allseatArray.push(`C${`00${i}`.slice(-3)}`)
}
function allSeatArrayFactory() {
	return _allseatArray.slice()
}

const getters = {
	seatsToShowAfterFilter (state) {
		let toShow

		// laptop
		if (state.laptop.laptopAllow) {
			toShow = dd.laptop.laptopAllow
		} else if (state.laptop.laptopForbidden) {
			toShow = dd.laptop.laptopForbidden
		} else {
			toShow = allSeatArrayFactory()
		}

		// table.seatCount
		if (state.table.seatCount.seats4) { toShow = _.intersection(toShow, dd.table.seatCount.seats4) }
		else if (state.table.seatCount.seats6) { toShow = _.difference(toShow, dd.table.seatCount.seats4) }

		// table.partition
		if (state.table.partition) { toShow = _.intersection(toShow, dd.table.partition) }

		// near
		if (state.near.wall) { toShow = _.intersection(toShow, dd.near.wall) }
		else if (state.near.window) { toShow = _.intersection(toShow, dd.near.window) }

		// away
		if (state.away.vent) { toShow = _.intersection(toShow, dd.away.vent) }
		if (state.away.toilet) { toShow = _.intersection(toShow, dd.away.toilet) }
		if (state.away.register) { toShow = _.intersection(toShow, dd.away.register) }
		if (state.away.aisle) { toShow = _.intersection(toShow, dd.away.aisle) }

		return toShow
	},
}

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
	getters,
	mutations,
	actions,
}

