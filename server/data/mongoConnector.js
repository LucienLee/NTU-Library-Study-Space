import { MongoClient } from 'mongodb'
import chalk from 'chalk'
import lib from './libAPIConnector'

const DB = {}

const mongo = MongoClient.connect('mongodb://localhost/library', (err, db) => {
	if (err) throw chalk.red.bgWhite.underline.bold(' ***Error connecting to MongoDB, make sure you have MongoDB running!!!*** ')

	console.log('Connected to MongoDB')
	DB.Student = db.collection('student')
	DB.Student.createIndex({ student_id: 1 }, { unique: true })
	DB.Record = db.collection('record')
	DB.Record.createIndex({ student_id: 1, seat_id: 1 })

	lib.invalidate()
})

export default DB
