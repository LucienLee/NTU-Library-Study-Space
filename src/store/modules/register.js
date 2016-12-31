import 'whatwg-fetch'
import _ from 'lodash'
import { registerURL as url } from 'credential'

const initialStateFactory = () => ({
  inputFields: {
    seatIDValue: '',
    userIDValue: ''
  },
  loading: false,
  result: {},
  error: {},
  user: {
    id: '',
    isValid: false,
    token: null,
    seatIdOld: null,
    error: {}
  }
})

function errorFactory ({ message, message_en: messageEN }) {
  return {
    message: message || messageEN,
    message_en: messageEN
  }
}

const getters = {
  doneRequest: state => {
    return !_.isEmpty(state.result) || !_.isEmpty(state.error)
  }
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
  }
}

const actions = {
  updateRegisterInputValue ({ commit }, { key, value }) {
    commit('UPDATE_REGISTER_INPUT_VALUE', { key, value })
  },
  checkUser ({ commit, dispatch }, { userId }) {
    if (!userId) throw new Error(`userId: "${userId}" empty`)

    fetch(`${url}checkUser?user_id=${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.authority) {
          // valid
          commit('USER_CHECKED', {
            id: userId,
            isValid: true,
            token: json.token,
            seatIdOld: json.seat_id || null,
            error: null
          })

          // because valid, dispatch getHistory action
          dispatch('getHistory', { userId })
        } else {
          // Failed because of register rejected
          commit('USER_CHECKED', {
            id: userId,
            isValid: false,
            token: null,
            seatIdOld: null,
            error: json
          })
        }
      })
      .catch(err => {
        commit('CHECK_USER_ERROR', err)
      })
  },
  checkIn ({ commit, state }, { userId, seatId }) {
    if (!userId || !seatId) throw new Error(`userId: "${userId}" or seatId: "${seatId}" empty`)

    // start the loading flag
    commit('REGISTER_LOADING', true)

    new Promise(resolve => {
      // first check if there is already a token to use
      if (state.user.id === userId && state.user.isValid && state.user.token) {
        resolve()
      } else {
        // no token, so get one first
        fetch(`${url}checkUser?user_id=${userId}`)
          .then(res => res.json())
          .then(json => {
            // Failed because of not a valid user
            if (!json.authority) throw json

            // valid user
            commit('USER_CHECKED', {
              id: userId,
              isValid: true,
              token: json.token,
              seatIdOld: json.seat_id || null,
              error: null
            })

            resolve()
          })
      }
    })
      .then(() => {
        // second check if there's seat_id_old
        const seatIdOld = state.user.seatIdOld ? `&seat_id_old=${state.user.seatIdOld}` : ''
        const type = seatIdOld ? '&type=2' : '&type=1'

        // erase the token
        const token = state.user.token
        commit('CONSUME_TOKEN')

        // finally send out the request
        return fetch(`${url}checkin?user_id=${userId}&seat_id=${seatId}&token=${token}${type}${seatIdOld}`)
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
  checkOut ({ commit, state }, { userId }) {
    if (!userId) throw new Error(`userId: "${userId}" empty`)

    // set loading flag
    commit('REGISTER_LOADING', true)

    // first check if there is already a token to use
    if (state.user.id === userId && state.user.isValid && state.user.token) {
      // erase the token
      const token = state.user.token
      commit('CONSUME_TOKEN')

      // send out the request
      fetch(`${url}checkout?user_id=${userId}&token=${token}`)
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
      fetch(`${url}checkUser?user_id=${userId}`)
        .then(res => res.json())
        .then(json => {
          // Failed because of not a valid user
          if (!json.authority) throw json

          // valid
          return fetch(`${url}checkout?user_id=${userId}&token=${json.token}`)
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

