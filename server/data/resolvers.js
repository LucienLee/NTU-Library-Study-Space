import { DB, API } from './connectors'

const resolvers = {
	Query: {
		student(_, args) {
			return DB.Student.findOne({ student_id: args.student_id })
		},
		all_seats(_, args) {
			return API.getSeatInfo()
		},
	},
	Student: {
		most_used(student) {
			return Object.keys(student.freq)
				.map(key => ({ seat_id: key, times: student.freq[key] }))
				.sort((a, b) => ((a.times > b.times) ? -1 : ((b.times > a.times) ? 1 : 0)))
				.slice(0, 3)
		},
	},
	Mutation: {
		addStudent (_, args) {
			console.log(args)
			Student.insert({ student_id: args.student_id, recent_seats: [] })
			return Student.findOne({ student_id: args.student_id })
		},
	},
}

export default resolvers
