import _ from 'lodash'
import ranges from '../../utils/seat-range.js'
import seatFilterConfig from '../../seat-config.json'

// Create seat factory singleton
const seatsFactory = (function () {
  const seatsArray = []
  const seatsObject = {}

  for (let area in ranges) {
    let range = ranges[area]
    for (let section = 0; section < range.length / 2; section++) {
      let start = section * 2
      let end = start + 1
      for (let i = range[start]; i <= range[end]; i++) {
        seatsArray.push(`${area}${`00${i}`.slice(-3)}`)
        seatsObject[`${area}${`00${i}`.slice(-3)}`] = false
      }
    }
  }

  return {
    getSeats (type = 'array') {
      if (type === 'array') return seatsArray
      else if (type === 'object') return seatsObject
    }
  }
})()

// state
const state = {
  laptop: {
    laptopAllow: false,
    laptopForbidden: false
  },
  table: {
    seats4: false,
    seats6: false,
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

// getters
const getters = {
  seatsToShowAfterFilter (state) {
    let collection = [seatsFactory.getSeats()]
    let seats = _.clone(seatsFactory.getSeats('object'))

    for (let category in state) {
      for (let prop in state[category]) {
        if (state[category][prop] === true) {
          collection.push(seatFilterConfig[category][prop])
        }
      }
    }

    Object.keys(seats).forEach(function (key) {
      seats[key] = false
    })

    _.intersection(...collection).forEach((key) => {
      seats[key] = true
    })

    return seats
  }
}

// mutations
const mutations = {
  UPDATE_FILTER (state, {category, key, value}) {
    state[category][key] = value
  },
  CLEAR_FILTER (state) {
    for (let category in state) {
      for (let prop in state[category]) {
        state[category][prop] = false
      }
    }
  }
}

// actions
const actions = {
  updateFilter ({ commit }, update) {
    commit('UPDATE_FILTER', update)
  },
  clearFilter ({ commit }) {
    commit('CLEAR_FILTER')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

