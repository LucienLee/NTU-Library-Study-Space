const state = {
  focused: ''
}

const mutations = {
  ACTIVATE_LIST (state, key) {
    state.focused = key
  },
  CLEAR_LIST (state) {
    state.focused = ''
  }
}

const actions = {
  focusListItem ({ commit }, val) {
    commit('ACTIVATE_LIST', val)
  },
  blurListItem ({ commit }) {
    commit('CLEAR_LIST')
  }
}

export default {
  state,
  mutations,
  actions
}
