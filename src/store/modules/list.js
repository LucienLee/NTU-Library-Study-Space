const state = {
	focused: ''
}

const mutations = {
	ACTIVATE_LIST (state, key) {
		state.focused = key
	},
	ClEAR_LIST (state) {
		state.focused = ''
	}
}

const actions = {
	focusListItem ({ commit }, val) {
		commit('ACTIVATE_LIST', val)
	}
}

export default {
	state,
	mutations,
	actions,
}
