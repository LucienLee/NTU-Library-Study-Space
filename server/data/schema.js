const typeDefinitions = `
scalar Date

type Student {
  _id: ID
  student_id: String!
  recent_seats: [RecentSeat]!
}

type RecentSeat {
  seat_id: String!
  start_time: Date
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

type Mutation {
  addStudent(student_id: String!): Student
}

schema {
  query: Query
  mutation: Mutation
}
`;

export default [typeDefinitions];
