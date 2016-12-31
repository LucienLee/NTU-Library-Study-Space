import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import { schema as libSchema, resolvers as libResolvers } from './library/schema'
import { schema as mongoSchema, resolvers as mongoResolvers } from './mongo/schema'

const rootSchema = [`

# Root Queries
type Query {
  # Get the data for a specifit \`Student\` by \`student_id\`
  student(
    # The student_id of the student
    student_id: String
  ): Student

  # This is a ***JSON encoded string*** of the *Object* version of the \`getSeatInfo\` API.
  #
  # We convert the returned *Array* from \`getSeatInfo\` to *Object* with the \`seat_id\` as keys,
  # and convert it to JSON string.
  allSeatsObjectJSON: String!
  # redundent legacy api (for backwards compatibility)
  seatInfo: String!
}

#type Mutation {
#}

#type Subscription {
  ## Subscription fires on every comment added
  #seatAdded(seat_id: String!): TODO
#}


schema {
  query: Query
  #mutation: Mutation
  #subscription: Subscription
}

`]

const rootResolvers = {
  Query: {
    student (_, { student_id }, { Student }) {
      return Student.getStudentByStudentID(student_id)
    },
    allSeatsObjectJSON (root, args, { LibAPI }) {
      return LibAPI.getAllSeatsAsObjectJSON()
    },
    seatInfo (root, args, { LibAPI }) {
      return LibAPI.getAllSeatsAsObjectJSON()
    }
  }
  // Mutation: {},
  // Subscription: {}
}

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [...rootSchema, ...libSchema, ...mongoSchema]
const resolvers = merge(rootResolvers, libResolvers, mongoResolvers)

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
})

export default executableSchema

