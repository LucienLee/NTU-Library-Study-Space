/**
 * Here are credential APIs, which are used to check in study space.
 * If you would like to contribute this project, please email us to get the secret urls.
 * After you fill the api url, please duplicate this file as index.js.
 */

const { REGISTER_API_ENV, HISTORY_API_ENV } = process.env

// Register API is the library API handling `getSeatInfo`, `checkUser`, `checkIn`
let registerURL
if (REGISTER_API_ENV === 'development') registerURL = 'http://localhost:3000/StudyRoom/api/'
if (REGISTER_API_ENV === 'staging') registerURL = ''
if (REGISTER_API_ENV === 'production') registerURL = ''

// History API is the GraphQL API we developed to store user usage record, and caches the `getSeatInfo`
let historyURL
if (HISTORY_API_ENV === 'development') historyURL = 'http://localhost:3000'
if (HISTORY_API_ENV === 'production') historyURL = ''

export default {
	registerURL,
	historyURL
}

