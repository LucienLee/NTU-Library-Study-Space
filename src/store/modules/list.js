const state = {
	expandinglist: {}
}

const mutations = {
	REGISTER_LIST (state, key) {
		state.expandinglist[key] = false
	},
	UNREGISTER_LIST (state, key) {
		delete state.expandinglist[key]
	},
	ACTIVATE_LIST (state, key) {
		for(let prop in state.expandinglist) {
			if (prop === key){
				state.expandinglist[prop] = true
			} else {
				state.expandinglist[prop] = false
			}
		}
	}
}

const actions = {
	registerList ({ commit }, val) {
		commit('REGISTER_LIST', val)
	},
	focusListItem ({ commit }, val) {
		commit('ACTIVATE_LIST', val)
	}
}

export default {
	state,
	mutations,
	actions,
}
