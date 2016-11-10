import { DB, API } from './connectors'

function sortedIndex(array, value) {
    let low = 0, high = array.length;
    while (low < high) {
        const mid = (low + high) >>> 1;
        if (array[mid].times > value) low = mid + 1;
        else high = mid;
    }
    return low;
}

const resolvers = {
	Query: {
		student(_, args) {
			return DB.Student.findOne({ student_id: args.student_id })
		},
		all_seats() {
			return API.getSeatInfo()
		},
		seatInfo() {
			return API.getSeatInfoObjectJSON()
		},
	},
	Student: {
		last_used({ last_used }) {
			return { seat_id: last_used, status: API.getSeatStatus(last_used) }
		},
		most_used({ freq }, { num = 3 }) {
			let ret = [], min = 0
			Object.keys(freq).forEach(key => {
				if (freq[key] > min) {
					ret.splice(sortedIndex(ret, freq[key]), 0, { seat_id: key, times: freq[key] })
					ret = ret.slice(0, num)
					min = ret[num - 1] ? ret[num - 1].times : 0
				}
			})
			return ret
		},
	},
	SeatUsedElement: {
		status({ seat_id }) {
			return API.getSeatStatus(seat_id)
		}
	},
}

export default resolvers
