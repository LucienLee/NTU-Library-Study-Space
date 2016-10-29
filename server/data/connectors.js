import DB from './mongoConnector'
import lib from './libAPIConnector'
import { sanitizeUserId, arr2obj } from './utils'

const API = {
	getSeatInfo () {
		return lib.seatsArray || []
		// const ret =  require('./fake.json')
		// delete require.cache[require.resolve('./fake.json')]
		// return ret
	}
}

export { API, DB }

