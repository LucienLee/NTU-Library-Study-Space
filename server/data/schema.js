const typeDefinitions = `
scalar Date

type Student {
  _id: ID
  student_id: String!
  last_used: SeatUsedElement!
  most_used(num: Int): [SeatUsedElement]!
}

type SeatUsedElement {
  seat_id: String!
  times: Int!
  status: String!
}

type LiveSeat {
  seat_id: String!
  status: String!
  start_time: String
  tmp_exit_time: Date
  keep_time: Int
  user_id: String
}

type Query {
  student(student_id: String!): Student
  all_seats: [LiveSeat]!
}

schema {
  query: Query
}
`;

export default [typeDefinitions];
