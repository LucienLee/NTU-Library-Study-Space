import { Student, API } from './connectors'

const resolvers = {
	Query: {
		student(_, args) {
			return Student.findOne({ student_id: args.student_id })
		},
		all_seats(_, args) {
			return API.getSeatInfo()
		},
	},
	Student: {
		most_used(student) {
			return []
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
