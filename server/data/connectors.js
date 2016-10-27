import { MongoClient } from 'mongodb'
import rp from 'request-promise';
import _ from 'lodash'

function sanitizeUserId (userId) {
	// TODO do we pop the last digit or what???
	// return userId.toUpperCase().slice(0, -1)
	return userId.toUpperCase()
}

// Library API
class LibraryAPI {
	constructor() {
		this.seatsArray = []
		this.lastSeatsArray = []
	}
	invalidate() {
		console.log('now invalidate!')
		this.lastSeatsArray = this.seatsArray
		// this.lastSeats = this.seats

		this.getSeatInfo()
			.then(() => {
				this.diffSeatsArray()
				setTimeout(this.invalidate.bind(this), 10000)
			})

	}

	getSeatInfo() {
		return this.seatsArray = rp('http://140.112.113.35:8080/StudyRoom/api/getSeatInfo')
			.then(res => {
				this.seatsArray = JSON.parse(res)
				return this.seatsArray
			})
			.catch(err => console.error('rp/JSON.parse error:', err))
			// .then(() => {
			// 	this.seats = this.seatsArray.reduce((o, v, i) => {
			// 		o[v.seat_id] = v;
			// 		return o;
			// 	}, {});
			// })
	}

	diffSeatsArray() {
		const { seatsArray, lastSeatsArray } = this
		if (seatsArray.length !== lastSeatsArray.length) return

		const timestamp = Date.now()
		for (let i = 0; i < lastSeatsArray.length; ++i) {
			if (!_.isEqual(seatsArray[i], lastSeatsArray[i])) { // changed!
				console.log('found diff! old:', lastSeatsArray[i], 'new:', seatsArray[i])
				// NEW 0 -> 1or2
				if (lastSeatsArray[i].status === '0' && (seatsArray[i].status === '1') || seatsArray[i].status === '2') {
					createRecord({
						student_id: seatsArray[i].user_id,
						seat_id: seatsArray[i].seat_id,
						action: 'NEW',
						timestamp: Date.parse(seatsArray[i].start_time),
					})
				} // EXIT 1or2 -> 0
				else if ((lastSeatsArray[i].status === '1' || lastSeatsArray[i].status === '2') && seatsArray[i].status === '0') {
					createRecord({
						student_id: lastSeatsArray[i].user_id,
						seat_id: seatsArray[i].seat_id,
						action: 'EXIT',
						timestamp,
					})
				} // BRB 1 -> 2
				else if (lastSeatsArray[i].status === '1' && seatsArray[i].status === '2') {
					createRecord({
						student_id: seatsArray[i].user_id,
						seat_id: seatsArray[i].seat_id,
						action: 'BRB',
						timestamp,
					})
				} // BACK 2 -> 1
				else if (lastSeatsArray[i].status === '2' && seatsArray[i].status === '1') {
					createRecord({
						student_id: seatsArray[i].user_id,
						seat_id: seatsArray[i].seat_id,
						action: 'BACK',
						timestamp,
					})
				}
			}
		}
	}
}

let Student, Record
const lib = new LibraryAPI()
const mongo = MongoClient.connect('mongodb://localhost/library', (err, db) => {
	if (err) console.error(err)

	console.log('Connected to MongoDB')
	Student = db.collection('student')
	Student.createIndex({ student_id: 1 }, { unique: true })
	Record = db.collection('record')
	Record.createIndex({ student_id: 1, seat_id: 1 })

	lib.invalidate()
})


function createRecord(doc) {
	Record.insert(doc)

	// update `Student`
	if (doc.action = 'NEW') {
		const operation = {
			$set: { last_used: doc.seat_id },
			$inc: {}
		}
		// increment freq.SEAT_ID
		operation.$inc[`freq.${doc.seat_id}`] = 1

		Student.update({ student_id: sanitizeUserId(doc.student_id) }, operation, { upsert: true })
	}
}

function arr2obj(arr, key) {
	return arr.reduce((o, v, i) => {
		o[v[key]] = v;
		return o;
	}, {});
}


const API = {
	getSeatInfo () {
		return lib.seatsArray || []
		// const ret =  require('./fake.json')
		// delete require.cache[require.resolve('./fake.json')]
		// return ret
	}
}

export { Student, API }

