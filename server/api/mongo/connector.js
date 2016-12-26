import { MongoClient } from 'mongodb'
import chalk from 'chalk'
import { log } from 'winston'

const DB = {}

MongoClient.connect('mongodb://localhost/library', (err, db) => {
  if (err) {
    log('error',
      chalk.red.bgWhite.underline.bold(' ***Error connecting to MongoDB, make sure you have MongoDB running!!!*** ')
    )
  }

  log('info', 'Connected to MongoDB')

  DB.Students = db.collection('student')
  DB.Students.createIndex({ student_id: 1 }, { unique: true })
  DB.Records = db.collection('record')
  DB.Records.createIndex({ student_id: 1, seat_id: 1 })

  // gracefully stop
  process.on('SIGINT', () => {
    db.close(err => {
      process.exit(err ? 1 : 0)
    })
  })
})

export default DB

