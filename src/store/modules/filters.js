import _ from 'lodash'
import ranges from '../../utils/seat-range.js'

const seatFilterConfig = require('../../dd.json')

const initialUIStateFactory = () => ({
	laptop: {
		laptopAllow: false,
		laptopForbidden: false,
	},
	table: {
		seats4: false,
		seats6: false,
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

// Create seat factory singleton
const seatsFactory = (function(){
	const seats = []
	for ( let area in ranges ) {
		let range = ranges[area]
		for (let section = 0; section < range.length/2; section++ ) {
			let start = section * 2
			let end = start + 1
			for ( let i = range[start]; i <= range[end]; i++ ) {
				seats.push( `${area}${`00${i}`.slice(-3)}` )
			}
		}
	}

	return {
		getSeats () {
			return seats
		}
	}

})()

const getters = {
	seatsToShowAfterFilter (state) {
		let collection = [seatsFactory.getSeats()]
		for ( let category in state ) {
			for ( let prop in state[category] ) {
				if ( state[category][prop] === true ) {
					collection.push(seatFilterConfig[category][prop])
				}
			}
		}

		return _.intersection(...collection)
	}
}

// mutations
const mutations = {
	UPDATE_LAPTOP (state, val) {
		state.laptop = val
	},
	UPDATE_TABLE_SEATCOUNT (state, val) {
		for (let prop in val) {
			state.table[prop] = val[prop]
		}
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
		const is = initialUIStateFactory()
		for (let prop in is) {
			state[prop] = is[prop]
		}
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

const state = initialUIStateFactory()
export default {
	state,
	getters,
	mutations,
	actions,
}

