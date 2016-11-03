import fetch from 'node-fetch';
import _ from 'lodash'
import chalk from 'chalk'
import { Record, Student } from './mongoConnector'
import { arr2obj } from './utils'

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
		this.seats = {}
		this.seatsArray = []
		this.lastSeatsArray = []
	}
	invalidate() {
		this.lastSeatsArray = this.seatsArray

		this.getSeatInfo()
			.then(() => {
				this.diffSeatsArray()
				setTimeout(this.invalidate.bind(this), 1000)
			})

	}

	getSeatInfo() {
		return fetch('http://140.112.113.35:8080/StudyRoom/api/getSeatInfo')
			.then(res => {
				return res.json()
			})
			.then(json => {
				this.seatsArray = json
				this.seats = arr2obj(json)
			})
			.catch(err => console.error(
				chalk.red(err)
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
