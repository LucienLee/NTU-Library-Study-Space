import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

const PORT = process.env.PORT || 3000

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

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

app.listen(PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${PORT}/graphql`
))

