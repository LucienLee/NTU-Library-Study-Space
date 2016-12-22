import { sortedIndex } from '../utils/utils'

export const schema = [`

# This is the student data stored in MongoDB.
#
# It consist of info about the student's **favorite seats** and the **last seat** he/she used.
type Student {
  # The \`_id\` field in MongoDB.
  _id: ID

  # The NTU authorized \`student_id\` on your card.
  student_id: String!

  # The last seat this student used (only store one, the latest).
  #
  # This wont be \`null\`/\`undefined\`  because if the student haven't had a record yet, he/she won't even be in the DB at all.
  last_used: LastUsedSeat!

  # The record of seat usage frequency of which this student had used.
  #
  # Will return ***an array of objects***, sorted from the most used to the least used.
  #
  # Pass in the amount you want to get to the optional \`limit\` param, or by default only returns the top 3.
  most_used(
    # The amount you want to query, defaults to \`3\`.
    limit: Int
  ): [MostUsedSeat]!
}

# The \`last_used\` element of student, consist of \`seat_id\` and the \`status\` of this seat.
type LastUsedSeat {
  # The id of the seat.
  seat_id: String!

  # The status of the seat.
  status: String!
}

# The \`most_used\` element of student, consist of \`seat_id\`, the status of this seat and how many times did the student choose to use this seat (the \`times\` field).
type MostUsedSeat {
  # The id of the seat.
  seat_id: String!

  # How many times did the student use this seat.
  times: Int!

  # The status of the seat.
  status: String!
}

`]

// resolver function signature: (root, args, context)
export const resolvers = {
  Student: {
    last_used ({ last_used }) {
      // note that the `status`field is resolved below
      // in the `LastUsedSeat.status` resolver
      return { seat_id: last_used }
    },
    most_used ({ freq }, { limit = 3 }) {
      // the freq field is a object with `seat_id` as key and times as value
      // We need to sort it first, to get the top `limit` limits
      let ret = []
      let min = 0
      Object.keys(freq).forEach(key => {
        if (freq[key] > min) {
          // return the `seat_id` and `times` fields,
          // `status` field is resolved below in `MostUsedSeat.status`
          ret.splice(sortedIndex(ret, freq[key]), 0, { seat_id: key, times: freq[key] })

          // only keep the top `limit` numbers
          ret = ret.slice(0, limit)
          min = ret[limit - 1] ? ret[limit - 1].times : 0
        }
      })
      return ret
    }
  },
  LastUsedSeat: {
    status ({ seat_id }, _, { LibAPI }) {
      return LibAPI.getSeatStatus(seat_id)
    }
  },
  MostUsedSeat: {
    status ({ seat_id }, _, { LibAPI }) {
      return LibAPI.getSeatStatus(seat_id)
    }
  }
}

