// import * as types from '../mutation-types'

const state = {
	laptop: {
		laptopAllow: false,
		laptopForbidden: false
	},
	table: {
		four: false,
		six: false,
		partition: false
	},
	near: {
		wall: false,
		window: false
	},
	away: {
		vent: false,
		toilet: false,
		register: false,
		aisle: false
	}
}

// mutations
const mutations = {
	UPDATE_LAPTOP (store, val) {
		store.laptop = val
	},
	UPDATE_TABLE_SEATCOUNT (store, val) {
		store.table = Object.assign({}, store.table, val)
	},
	UPDATE_TABLE_PARTITION (store, val) {
		store.table = Object.assign({}, store.table, val)
	},
	UPDATE_NEAR (store, val) {
		store.near = val
	},
	UPDATE_AWAY_VENT (store, val) {
		store.away.vent = val
	},
	UPDATE_AWAY_TOILET(store, val) {
		store.away.toilet = val
	},
	UPDATE_AWAY_REGISTER (store, val) {
		store.away.register = val
	},
	UPDATE_AWAY_AISLE (store, val) {
		store.away.aisle = val
	},
	// [types.ADD_TO_CART] (state, { id }) {
	// 	state.lastCheckout = null
	// 	const record = state.added.find(p => p.id === id)
	// 	if (!record) {
	// 		state.added.push({
	// 			id,
	// 			quantity: 1
	// 		})
	// 	} else {
	// 		record.quantity++
	// 	}
	// },
    //
	// [types.CHECKOUT_REQUEST] (state) {
	// 	// clear cart
	// 	state.added = []
	// 	state.checkoutStatus = null
	// },
    //
	// [types.CHECKOUT_SUCCESS] (state) {
	// 	state.checkoutStatus = 'successful'
	// },
    //
	// [types.CHECKOUT_FAILURE] (state, { savedCartItems }) {
	// 	// rollback to the cart saved before sending the request
	// 	state.added = savedCartItems
	// 	state.checkoutStatus = 'failed'
	// }
}

const actions = {
	updateLaptopAllow({ commit }, val) {
		commit('UPDATE_LAPTOP', { laptopAllow: val, laptopForbidden: false })
	},
	updateLaptopForbidden({ commit }, val) {
		commit('UPDATE_LAPTOP', { laptopAllow: false, laptopForbidden: val })
	},
	updateSeatFour({ commit }, val) {
		commit('UPDATE_TABLE_SEATCOUNT', { four: val, six: false })
	},
	updateSeatSix({ commit }, val) {
		commit('UPDATE_TABLE_SEATCOUNT', { four: false, six: val })
	},
	updatePartition({ commit }, val) {
		commit('UPDATE_TABLE_PARTITION', { partition: val })
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
}

export default {
	state,
	mutations,
	actions,
}

