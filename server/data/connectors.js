import DB from './mongoConnector'
import lib from './libAPIConnector'

const API = {
	getSeatInfo () {
		return lib.seatsArray || []
		// const ret =  require('./fake.json')
		// delete require.cache[require.resolve('./fake.json')]
		// return ret
	},
	getSeatStatus (seat_id) {
		return (lib.seats[seat_id] && lib.seats[seat_id].status) || 'empty'
	}
}

export { API, DB }

