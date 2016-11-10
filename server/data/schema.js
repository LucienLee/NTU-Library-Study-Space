
function seatInfoAllSchemaFactory(prefix, start, end) {
	let ret = ''
	for (let i = start; i <= end; ++i) {
		ret = `${ret}\n${prefix}${(`00${i}`.slice(-3))}: LiveSeat`
	}
	return ret
}

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

type SeatInfoAll {
  ${seatInfoAllSchemaFactory('A', 1, 224)}
  ${seatInfoAllSchemaFactory('A', 231, 300)}
  ${seatInfoAllSchemaFactory('B', 1, 180)}
  ${seatInfoAllSchemaFactory('C', 1, 348)}
}

type Query {
  student(student_id: String!): Student
  all_seats: [LiveSeat]!
  seatInfo: SeatInfoAll
}

schema {
  query: Query
}
`;

export default [typeDefinitions];
