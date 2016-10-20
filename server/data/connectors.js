import { MongoClient } from 'mongodb'
import rp from 'request-promise';

let Student
const mongo = MongoClient.connect('mongodb://localhost/library', (err, db) => {
	if (err) throw err

	console.log('Connected to MongoDB')
	Student = db.collection('student')
	Student.createIndex({ student_id: 1 }, { unique: true })
})












// Library API

const API = {
	getSeatInfo () {
		// return rp('http://140.112.113.35:8080/StudyRoom/api/getSeatInfo')
		// 	.then(res => JSON.parse(res))
		// 	.then(res => res[0].fortune.message);
		// console.log(require('../getSeatInfo.json')[0].status)
		return require('../getSeatInfo.json')
  },
};

export { Student, API }

