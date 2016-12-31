import fetch from 'node-fetch'
import _ from 'lodash'
import chalk from 'chalk'
import { log } from 'winston'
import { arr2objSelect } from '../utils/utils'
import { LIBRARY_API_URL } from '../../../.config'

/**
 * LibAPI connector
 * responsible for fetching library's API and diff the response
 * update MongoDB if found difference
 */
export class LibAPIConnector {
  constructor (Record) {
    this.Record = Record

    this.seatsArray = []
    this.lastSeatsArray = []

    this.seats = {}
    this.seatsJSON = JSON.stringify({})

    // start the fetching process after 3 seconds to be safe :)
    setTimeout(this.invalidate.bind(this), 3000)
  }

  /**
   * This method will call itself (in setTimeout) repeatedly after its done
   * The process is:
   * 1. fetch the /getSeatInfo api (with `this.fetch`)
   * 2. diff the response, and update MongoDB accordingly (with `this.diffSeatsArray`)
   * 3. setTimeout and call itself
   */
  invalidate () {
    // save the previous result before fetching, so we can diff the results
    this.lastSeatsArray = this.seatsArray

    this.fetch('/getSeatInfo')
      .then(() => {
        this.diffSeatsArray()

        // re-invalidate after 3 seconds
        setTimeout(this.invalidate.bind(this), 3000)
      })
      .catch(err => {
        if (err.name === 'SyntaxError') {
          // may be JSON.parse parsing 'illegal access!'
        } else if (err.name === 'FetchError') {
          // may be connection error
        } else if (err.name === 'TypeError') {
          // may be connection error
        }

        log('error', chalk.red(err))

        // re-invalidate after 30 seconds
        setTimeout(this.invalidate.bind(this), 30000)
      })
  }

  /**
   * fetch the LIBRARY_API_URL with `endpoint`
   * @param {string} endpoint - the endpoint with the leading `/`, eg. fetch('/getSeatInfo')
   */
  fetch (endpoint) {
    log('verbose', 'now fetching LibAPI...')
    return fetch(LIBRARY_API_URL + endpoint)
      .then(res => {
        return res.json()
      })
      .then(json => {
        this.seatsArray = json
        this.seats = arr2objSelect(json, 'seat_id', ['status'])
        this.seatsJSON = JSON.stringify(this.seats)
      })
  }

  /**
   * Diff `seatsArray` and `lastSeatsArray`, and update MongoDB accordingly.
   */
  diffSeatsArray () {
    const { seatsArray, lastSeatsArray } = this

    // exit if seatsArray or lastSeatsArray are empty
    if (!seatsArray || !lastSeatsArray || seatsArray.length !== lastSeatsArray.length) return

    // get the time now, so all diffs we found in this fetch will have the same timestamp
    const timestamp = Date.now()

    // start the diffing process
    // iterate thru `lastSeatsArray`
    for (let i = 0; i < lastSeatsArray.length; ++i) {
      // use _.isEqual to deep compare objects
      if (!_.isEqual(seatsArray[i], lastSeatsArray[i])) { // changed!
        log('debug', 'found diff in LibAPIConnector!', {
          oldSeat: lastSeatsArray[i],
          newSeat: seatsArray[i]
        })

        const oldStatus = lastSeatsArray[i].status
        const newStatus = seatsArray[i].status

        // setup the document to be added to MongoDB's Record
        // get the action type: 'NEW', 'EXIT', 'BRB' or 'BACK'
        // and fields: student_id, seat_id, action, timestamp.
        const doc = {
          student_id: seatsArray[i].user_id,
          seat_id: seatsArray[i].seat_id, // seat_id are all the same: seatsArray[i].seat_id
          timestamp
        }
        if (oldStatus === '0' && (newStatus === '1' || newStatus === '2')) {
          // NEW 0 -> 1 or 2
          doc.action = 'NEW'

          // try to use the `start_time` as timestamp, falls back to `timestamp`
          doc.timestamp = Date.parse(seatsArray[i].start_time) || timestamp
        } else if ((oldStatus === '1' || oldStatus === '2') && newStatus === '0') {
          // EXIT 1 or 2 -> 0
          doc.action = 'EXIT'

          // seatsArray[i].user_id is empty for this case
          doc.student_id = lastSeatsArray[i].user_id
        } else if (oldStatus === '1' && newStatus === '2') {
          // BRB 1 -> 2
          doc.action = 'BRB'
        } else if (oldStatus === '2' && newStatus === '1') {
          // BACK 2 -> 1
          doc.action = 'BACK'
        }

        // add to Record
        this.Record.addRecord(doc)
      }
    } // end for
  } // end diffSeatsArray

}

