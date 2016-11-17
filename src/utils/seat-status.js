export function mapStatusToState(status) {
	switch (status) {
		case '0':
			return 'empty'
		case '1':
			return 'used'
		case '2':
			return 'left'
		case '-1':
		case '-2':
			return 'banned'
		default:
			return 'error'
	}
}

