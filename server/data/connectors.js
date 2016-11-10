import DB from './mongoConnector'
import lib from './libAPIConnector'
import { arr2obj } from './utils'

const API = {
	getSeatInfo () {
		// return lib.seatsArray || []
		const ret =  require('./getSeatInfo.json')
		delete require.cache[require.resolve('./getSeatInfo.json')]
		return ret
	},
	getSeatInfoObject () {
		// return lib.seats|| {}
		const ret =  require('./getSeatInfo.json')
		delete require.cache[require.resolve('./getSeatInfo.json')]
		return arr2obj(ret, 'seat_id')
	},
}

export { API, DB }

