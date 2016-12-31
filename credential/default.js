/**
 * Here are credential APIs, which are used to check in study space.
 * If you would like to contribute this project, please email us to get the secret urls.
 * After you fill the api url, please duplicate this file as index.js.
 */

const { REGISTER_API_ENV, HISTORY_API_ENV } = process.env

// Register API is the library API handling `getSeatInfo`, `checkUser`, `checkIn`
const registerURL = REGISTER_API_ENV === 'production'
  ? '' // production
  : REGISTER_API_ENV === 'staging'
    ? '' // staging
    : 'http://localhost:3000/StudyRoom/api/' // development

// History API is the GraphQL API we developed to store user usage record, and caches the `getSeatInfo`
const historyURL = HISTORY_API_ENV === 'production'
  ? '' // production
  : 'http://localhost:3000' // development

module.exports = {
  registerURL,
  historyURL
}

