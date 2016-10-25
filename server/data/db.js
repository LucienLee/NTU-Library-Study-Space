const record = {
	student_id: String, (index)
	seat_id: String, (index?)
	action: 'NEW', 'EXIT', 'BRB', 'BACK',
	timestamp: Date,
}

const student = {
	student_id: String, (index)
	freq: {
		A001: 3,
		B035: 2,
		C002: 3,
		C018: 15,
		...
	},
	last_used: String,
}
