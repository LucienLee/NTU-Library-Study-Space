import DB from './mongoConnector'
import lib from './libAPIConnector'
import { arr2objSelect } from './utils'

const API = {
	getSeatInfo() {
		return lib.seatsArray || []
		// const ret =  require('./getSeatInfo.json')
		// delete require.cache[require.resolve('./getSeatInfo.json')]
		// return ret
	},
	getSeatInfoObjectJSON() {
		return lib.seatsJSON || JSON.stringify({})
		// const ret =  require('./getSeatInfo.json')
		// delete require.cache[require.resolve('./getSeatInfo.json')]
		// return JSON.stringify(arr2objSelect(ret, 'seat_id', ['status']))
	},
	getSeatStatus(seat_id) {
		return (lib.seats[seat_id] && lib.seats[seat_id].status) || 'error'
	},
}

export { API, DB }

