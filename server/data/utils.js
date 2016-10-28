export function sanitizeUserId (userId) {
	// TODO do we pop the last digit or what???
	// return userId.toUpperCase().slice(0, -1)
	return userId.toUpperCase()
}

export function arr2obj(arr, key) {
	return arr.reduce((o, v, i) => {
		o[v[key]] = v;
		return o;
	}, {});
}

