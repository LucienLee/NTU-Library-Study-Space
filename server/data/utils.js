export function sanitizeUserId(userId) {
	return userId.toUpperCase()
}

export function arr2obj(arr, key) {
	return arr.reduce((o, v) => {
		o[v[key]] = v
		return o
	}, {})
}

export function arr2objSelect(arr, key, keys) {
	return arr.reduce((o, v) => {
		o[v[key]] = {}
		keys.forEach(k => o[v[key]][k] = v[k])
		return o
	}, {})
}
