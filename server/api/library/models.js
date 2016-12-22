import { LibAPIConnector } from './connector'

export class LibAPI {
  constructor () {
    this.connector = new LibAPIConnector()
  }

  getAllSeatsAsArray () {
    return this.connector.seatsArray
  }

  getAllSeatsAsObjectJSON () {
    return this.connector.seatsJSON
  }

  getSeatStatus (seatID) {
    return (this.connector.seats[seatID] && this.connector.seats[seatID].status) || 'error'
  }
}
