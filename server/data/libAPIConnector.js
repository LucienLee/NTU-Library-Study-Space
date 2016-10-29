import fetch from 'node-fetch';
import _ from 'lodash'
import chalk from 'chalk'
import { Record, Student } from './mongoConnector'

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

// Library API
class LibAPIConnector {
	constructor() {
		this.seatsArray = []
		this.lastSeatsArray = []
	}
	invalidate() {
		process.stdout.write('now invalidating... ')
		this.lastSeatsArray = this.seatsArray
		// this.lastSeats = this.seats

		this.getSeatInfo()
			.then(() => {
				this.diffSeatsArray()
				setTimeout(this.invalidate.bind(this), 5000)
			})

	}

	getSeatInfo() {
		return fetch('http://140.112.113.35:8080/StudyRoom/api/getSeatInfo')
			.then(res => {
				const contentType = res.headers.get('content-type')
				if (contentType && contentType.indexOf('applicatioin/json') !== -1)
					return res.json()
				throw 'illegal access!'
			})
			.then(json => {
				console.log(chalk.green('OK'))
				this.seatsArray = json
			})
			.catch(err => console.error(
				chalk.red(err=== 'illegal access!' ? 'fetch error:' : 'json error:', err)
			))
	}

	diffSeatsArray() {
		const { seatsArray, lastSeatsArray } = this
		if (!seatsArray || !lastSeatsArray || seatsArray.length !== lastSeatsArray.length) return

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

const lib = new LibAPIConnector()

export default lib
