import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import winston, { log } from 'winston'
import moment from 'moment'

const PORT = process.env.PORT || 3000

/**
 * Logging settings:
 * winston supports default 5 levels of logging,
 * { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
 * you can pass in LOGGING_LEVEL env when starting server to set the logging level,
 * eg: `LOGGING_LEVEL=verbose npm run dev`
 */
const loggingLevel = process.env.LOGGING_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
winston.configure({
  transports: [
    new (winston.transports.Console)({
      // The level of logging
      level: loggingLevel,
      // timestamp to be used
      timestamp () {
        return moment().format('YYYYMMDD-HH:mm:ss')
      },
      // custom formatter
      formatter (options) {
        // Return string will be passed to logger.
        return `${options.timestamp()}[${options.level.toUpperCase()}]${(options.message ? options.message : '')}${(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')}`
      }
    })
  ]
})

/**
 * The API server itself
 */
const app = express()

import cors from 'cors'
app.use(cors())

import schema from './api/schema'
import { LibAPI } from './api/library/models'
import { Student, Record } from './api/mongo/models'
const record = new Record()
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  context: {
    Student: new Student(),
    LibAPI: new LibAPI(record)
  }
}))

// only show GraphiQL when explicitly specified, or NODE_ENV not production
if (process.env.GRAPHIQL || process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
}

// mock the RegisterAPI
if (process.env.REGISTER_API_ENV !== 'staging' && process.env.REGISTER_API_ENV !== 'production') {
  require('./mock/setup-mock-server')(app)
}

app.listen(PORT, () => log('info',
  `GraphQL Server is now running on http://localhost:${PORT}/graphql`
))

