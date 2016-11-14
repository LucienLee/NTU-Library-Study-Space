export function mapStatusToState(status) {
	switch (status) {
		case '0':
			return 'empty'
		case '1':
			return 'used'
		case '2':
			return 'left'
		default:
			return 'error'
	}
}

