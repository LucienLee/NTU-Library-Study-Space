import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import filters from './modules/filters'
import seats from './modules/seats'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	mutations,
	modules: {
		filters,
		seats,
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
})
