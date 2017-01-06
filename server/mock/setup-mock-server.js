const { log } = require('winston')
const moment = require('moment')
const mockData = require('./mock-data.json')

const MY_FAKE_TOKEN = '1234A5678901B23aC45bcDEFdeG'
const userIdRegex = /^[A-Z][0-9]{9}$/

function obj2arr (obj) {
  return Object.keys(obj).map(key => obj[key])
}

function randomPickAvailableSeat () {
  log('verbose', 'now randomly picking seat')

  let done = false
  const keys = Object.keys(mockData)
  let pickedSeat
  let numTried = 0
  while (!done) {
    ++numTried

    // pick a key from object randomly
    pickedSeat = mockData[keys[keys.length * Math.random() << 0]]
    if (pickedSeat.status === '0') {
      done = true
    }
  }

  log('verbose', `got random seat=${pickedSeat.seat_id}, with ${numTried} trials`)
  return pickedSeat.seat_id
}

module.exports = function setupMockServer (app) {
  app.get('/StudyRoom/api/getSeatInfo', (req, res) => {
    log('verbose', 'getSeatInfo poked!')
    res.send(JSON.stringify(obj2arr(mockData)))
  })

  app.get('/StudyRoom/api/checkUser', (req, res) => {
    let userId = req.query.user_id
    log('verbose', `checkUser poked! user_id=${userId}`)

    // no `user_id`
    if (!userId) {
      return res.send(JSON.stringify({
        message_en: 'You did not provide a card number.',
        authority: false,
        message: '未提供使用者帳號'
      }))
    }

    // we store all upper
    userId = userId.toUpperCase()

    // check if userId is valid (this is a mock so only a regex)
    if (!userIdRegex.test(userId)) {
      log('debug', `user_id=${userId} not valid`)
      return res.send(JSON.stringify({
        message_en: 'Your card has either expired or does not have a record in the system.',
        authority: false,
        message: '帳號過期或不存在系統中'
      }))
    }
    log('debug', `user_id=${userId} valid!`)

    // search in the seats to see if the user has a seat now
    for (let key in mockData) {
      if (mockData[key].user_id === userId) {
        log('debug', `user_id=${userId} found in mockData, seat_id=${key}!`)

        return res.send(JSON.stringify({
          seat_id: mockData[key].seat_id,
          message_en: '',
          authority: true,
          message: '',
          token: MY_FAKE_TOKEN
        }))
      }
    }

    log('debug', `user_id=${userId} NOT found in mockData (don't have a seat yet)`)
    // no seats
    return res.send(JSON.stringify({
      message_en: '',
      authority: true,
      message: '',
      token: MY_FAKE_TOKEN
    }))
  })

  app.get('/StudyRoom/api/checkin', (req, res) => {
    log('verbose', `checkin poked! query=${JSON.stringify(req.query)}`)
    const userId = req.query.user_id
    const seatId = req.query.seat_id
    const seatIdOld = req.query.seat_id_old
    const { token } = req.query

    if (!userId || !token) {
      log('debug', 'no userId or token')
      return res.send(JSON.stringify({ message: 'parameter error' }))
    }

    // check token and userId
    if (!userIdRegex.test(userId) || token !== MY_FAKE_TOKEN) {
      log('debug', `userId or token invalid, userId=${userId}, token=${token}`)
      return res.send(JSON.stringify({ message: 'token error' }))
    }

    // check if the user have a seat already
    let oldSeat = null
    for (let key in mockData) {
      if (mockData[key].user_id === userId) {
        oldSeat = mockData[key].seat_id
        log('debug', `user already have a seat, seatId=${key}`)
        break
      }
    }

    // check if the requested seat is available
    if (seatId) {
      // if the requested seat is not in mockData
      if (!mockData[seatId] || mockData[seatId].status === '-1' || mockData[seatId].status === '-2') {
        log('debug', `chosen seat not available, seat_id=${seatId}`)
        return res.send(JSON.stringify({
          message_en: `The seat you chose is not available: ${seatId}`,
          message: `無此座位可指定:${seatId}`,
          affected: '0'
        }))
      }

      // seat already taken, status === '1'
      if (mockData[seatId].status === '1' || mockData[seatId].status === '2') {
        log('debug', `seat already taken, seat_id=${seatId}`)
        return res.send(JSON.stringify({
          message_en: 'The seat you chose is already taken. Please choose another one.',
          message: `${seatId}已為別位讀者所指定,請再指定其他座位`,
          affected: '0'
        }))
      }
      // passing this point means the requested seat is available,
      // will now check for other things
    }

    // if has seat in data
    if (oldSeat) {
      // if no seat_id_old specified, affected:0
      if (!seatIdOld) {
        log('debug', `have oldSeat but not providing seat_id_old, affected: '0', oldSeat=${oldSeat}, query=${JSON.stringify(req.query)}`)

        return res.send(JSON.stringify({
          message_en: `There is no record of your leaving in the system. You seat is:${oldSeat}`,
          message: `系統無刷出紀錄,您的座位為${oldSeat}`,
          affected: '0'
        }))
      } else {
        // if provided seatId, assign it; or else random
        if (seatId) {
          log('debug', `assigning ${userId} to ${seatId}, with oldSeat=${oldSeat}`)

          mockData[seatId] = {
            tmp_exit_time: '',
            keep_time: '0',
            status: '1',
            start_time: moment().format('YYYY/MM/DD HH:mm:ss:SSS'),
            seat_id: seatId,
            user_id: userId
          }

          return res.send(JSON.stringify())
        } else {
          // already have seat and not providing new seat_id, affected: 0
          log('debug', `${userId} already have oldSeat=${oldSeat} but not providing new seat_id, affected: 0`)

          return res.send(JSON.stringify({
            message_en: `There is no record of your leaving in the system. You seat is:${oldSeat}`,
            message: `系統無刷出紀錄,您的座位為${oldSeat}`,
            affected: '0'
          }))
        }
      }
    } else { // don't have oldSeat in data
      if (seatId) {
        log('debug', `assigning ${userId} to specified seat_id=${seatId}`)
        mockData[seatId] = {
          tmp_exit_time: '',
          keep_time: '0',
          status: '1',
          start_time: moment().format('YYYY/MM/DD HH:mm:ss:SSS'),
          seat_id: seatId,
          user_id: userId
        }

        return res.send(JSON.stringify({
          message_en: ` The system has assigned you to seat: ${seatId} , Welcome to the Study Room`,
          message: ` 座位已 指定至 ${seatId} 歡迎使用自習室 is assigned to the seat ${seatId} Welcome to Study Room`,
          affected: '1'
        }))
      } else {
        // random assign a seat
        let randomSeatId = randomPickAvailableSeat()

        log('debug', `RANDOM assigning ${userId} to seat_id=${randomSeatId}`)

        mockData[randomSeatId] = {
          tmp_exit_time: '',
          keep_time: '0',
          status: '1',
          start_time: moment().format('YYYY/MM/DD HH:mm:ss:SSS'),
          seat_id: randomSeatId,
          user_id: userId
        }

        return res.send(JSON.stringify({
          message_en: ` The system has assigned you to seat: ${randomSeatId} , Welcome to the Study Room`,
          message: ` 座位已 指定至 ${randomSeatId} 歡迎使用自習室 is assigned to the seat ${randomSeatId} Welcome to Study Room`,
          affected: '1'
        }))
      }
    }
  })

  app.get('/StudyRoom/api/checkout', (req, res) => {
    log('verbose', `checkout poked! query=${JSON.stringify(req.query)}`)
    const userId = req.query.user_id
    const { token } = req.query

    if (!userId || !token) {
      log('debug', 'no userId or token')
      return res.send(JSON.stringify({ message: 'parameter error' }))
    }

    // check token and userId
    if (!userIdRegex.test(userId) || token !== MY_FAKE_TOKEN) {
      log('debug', `userId or token invalid, userId=${userId}, token=${token}`)
      return res.send(JSON.stringify({ message: 'token error' }))
    }

    // check if the user have a seat already
    let oldSeat = null
    for (let key in mockData) {
      if (mockData[key].user_id === userId) {
        oldSeat = mockData[key].seat_id
        break
      }
    }

    if (oldSeat) {
      log('debug', `checking out ${userId} with seat ${oldSeat}`)

      mockData[oldSeat] = {
        tmp_exit_time: '',
        keep_time: '0',
        status: '0',
        start_time: '',
        seat_id: oldSeat,
        user_id: ''
      }

      const timeString = moment().format('HH:mm:ss')
      return res.send(JSON.stringify({
        message_en: ` is permanently leaving from the seat. (${timeString})`,
        message: ` 永久刷離座位! (${timeString})`,
        affected: '1'
      }))
    } else {
      log('debug', 'user don\'t have a seat yet but trying to checkout...')
      return res.send(JSON.stringify({
        message_en: 'There is no record of this number in the system. Please obtain a seat first.',
        message: '系統無此證號紀錄,請先刷入座位!',
        affected: '0'
      }))
    }
  })
}
