import DB from './connector'
import { sanitizeUserId } from '../utils/utils'

export class Student {
  getStudentByStudentID (studentID) {
    return DB.Students.findOne({ student_id: studentID })
  }
}

export class Record {
  addRecord (doc) {
    // first insert a record
    DB.Records.insert(doc)

    // then, update `Students`
    if (doc.action === 'NEW') {
      const operation = {
        $set: { last_used: doc.seat_id },
        $inc: {} // to be filled below
      }
      // increment freq.SEAT_ID
      operation.$inc[`freq.${doc.seat_id}`] = 1

      DB.Students.update({ student_id: sanitizeUserId(doc.student_id) }, operation, { upsert: true })
    }
  }
}

