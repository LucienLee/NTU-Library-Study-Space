export function sanitizeUserId (userId) {
  return userId.toUpperCase()
}

/**
 * convert an array `arr` to an object,
 * using the `keys` value from `arr` as the new object's key
 */
export function arr2obj (arr, key) {
  return arr.reduce((o, v) => {
    o[v[key]] = v
    return o
  }, {})
}

/**
 * Convert an array `arr` to an object, and only select certain keys.
 * Use the `key` value from `arr` as the new object's key,
 * and only include keys from the `keys` array.
 */
export function arr2objSelect (arr, key, keys) {
  return arr.reduce((o, v) => {
    o[v[key]] = {}
    keys.forEach(k => { o[v[key]][k] = v[k] })
    return o
  }, {})
}

/**
 * get the index of the `value` in the **sorted** `array`
 */
export function sortedIndex (array, value) {
  let low = 0
  let high = array.length
  while (low < high) {
    const mid = (low + high) >>> 1
    if (array[mid].times > value) low = mid + 1
    else high = mid
  }
  return low
}
