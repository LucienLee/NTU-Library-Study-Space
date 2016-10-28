import { MongoClient } from 'mongodb'
import chalk from 'chalk'
import lib from './libAPIConnector'

let Student, Record

const mongo = MongoClient.connect('mongodb://localhost/library', (err, db) => {
	if (err) throw chalk.red.bgWhite.underline.bold(' ***Error connecting to MongoDB, make sure you have MongoDB running!!!*** ')

	console.log('Connected to MongoDB')
	Student = db.collection('student')
	Student.createIndex({ student_id: 1 }, { unique: true })
	Record = db.collection('record')
	Record.createIndex({ student_id: 1, seat_id: 1 })

	lib.invalidate()
})


export {
	Record,
	Student,
}
