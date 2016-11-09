import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import filters from './modules/filters'
import seats from './modules/seats'
import register from './modules/register'
import list from './modules/list'
import history from './modules/history'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	mutations,
	modules: {
		filters,
		register,
		seats,
		list,
		history,
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
})
