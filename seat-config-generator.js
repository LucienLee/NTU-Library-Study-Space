const fs = require('fs')
const _ = require('lodash')

/********************/
/*		UTILS		*/
/********************/
const _allseatArray = []
for (let i = 1; i <= 224; ++i) {
	_allseatArray.push(`A${`00${i}`.slice(-3)}`)
}
for (let i = 231; i <= 300; ++i) {
	_allseatArray.push(`A${`00${i}`.slice(-3)}`)
}
for (let i = 1; i <= 180; ++i) {
	_allseatArray.push(`B${`00${i}`.slice(-3)}`)
}
for (let i = 1; i <= 348; ++i) {
	_allseatArray.push(`C${`00${i}`.slice(-3)}`)
}
function allSeatArrayFactory() {
	return _allseatArray.slice()
}

function seatArrayFactory(prefix, start, end) {
	let ret = []
	for (let i = start; i <= end; ++i) {
		ret.push(prefix + `00${i}`.slice(-3))
	}
	return ret
}

/********************/
/*		LAPTOP		*/
/********************/
let laptopAllow = [], laptopForbidden = []
laptopAllow = laptopAllow.concat(seatArrayFactory('A', 1, 224))
laptopAllow = laptopAllow.concat(seatArrayFactory('A', 231, 300))
laptopForbidden = laptopForbidden.concat(seatArrayFactory('B', 1, 180))
laptopForbidden = laptopForbidden.concat(seatArrayFactory('C', 1, 348))


/********************/
/*		TABLE		*/
/********************/
let seats4 = [], seats6 = [], partition = []
seats6 = seats6.concat(seatArrayFactory('A', 1, 36))
seats4 = seats4.concat(seatArrayFactory('A', 37, 44))
seats6 = seats6.concat(seatArrayFactory('A', 45, 224))
seats6 = seats6.concat(seatArrayFactory('A', 231, 284))
seats4 = seats4.concat(seatArrayFactory('A', 285, 300))
partition = partition.concat(seatArrayFactory('A', 1, 224))
partition = partition.concat(seatArrayFactory('A', 231, 284))

seats4 = seats4.concat(seatArrayFactory('B', 1, 24))
seats6 = seats6.concat(seatArrayFactory('B', 25, 48))
seats4 = seats4.concat(seatArrayFactory('B', 49, 72))
seats6 = seats6.concat(seatArrayFactory('B', 73, 180))
partition = partition.concat(seatArrayFactory('B', 1, 42))
partition = partition.concat(seatArrayFactory('B', 49, 72))
partition = partition.concat(seatArrayFactory('B', 79, 96))

seats6 = seats6.concat(seatArrayFactory('C', 1, 348))
partition = partition.concat(seatArrayFactory('C', 1, 24))
partition = partition.concat(seatArrayFactory('C', 37, 252))


/********************/
/*		NEAR		*/
/********************/
let window = []
// A區左邊 左下往上
window = window.concat(seatArrayFactory('A', 285, 288))
window = window.concat(seatArrayFactory('A', 293, 296))
window = window.concat(seatArrayFactory('A', 231, 260))
// C區右邊 由上往下
window = window.concat(seatArrayFactory('C', 235, 258))
window = window.concat(seatArrayFactory('C', 337, 348))

let wall = []
// A
wall = wall.concat(seatArrayFactory('A', 1, 30))
wall = wall.concat(seatArrayFactory('A', 41, 50))
wall = wall.concat(seatArrayFactory('A', 81, 86))
wall = wall.concat(seatArrayFactory('A', 117, 122))
wall = wall.concat(seatArrayFactory('A', 165, 170))
wall = wall.concat(seatArrayFactory('A', 219, 224))
wall = wall.concat(seatArrayFactory('A', 231, 300))
// B
wall = wall.concat(seatArrayFactory('B', 1, 48))
wall = wall.concat(seatArrayFactory('B', 97, 102))
wall = wall.concat(seatArrayFactory('B', 175, 180))
// C
wall = wall.concat(seatArrayFactory('C', 1, 36))
wall = wall.concat(seatArrayFactory('C', 43, 72))
wall = wall.concat(seatArrayFactory('C', 217, 258))
wall = wall.concat(seatArrayFactory('C', 271, 282))
wall = wall.concat(seatArrayFactory('C', 295, 348))

/********************/
/*		AWAY		*/
/********************/
/**
 * vent
 */
let nearVent = [
	/**
	 * A
	 */
	// 最左邊 左下往上
	'A296', 'A300', 'A232', 'A172',
	'A238', 'A241', 'A178', 'A182', 'A124', 'A127', 'A244', 'A247', 'A184', 'A187', 'A130', 'A133',
	'A253', 'A193', 'A139', 'A256', 'A195', 'A142', 'A145',
	'A262', 'A265', 'A202', 'A206', 'A151', 'A267', 'A209', 'A153',
	'A274', 'A277', 'A214', 'A159', 'A163', 'A280', 'A220', 'A223', 'A170',
	// 左邊中間 由下往上
	'A046', 'A001', 'A088', 'A092', 'A052', 'A055', 'A009', 'A011',
	'A094', 'A097', 'A058', 'A062', 'A015', 'A016', 'A103', 'A067', 'A022',
	'A105', 'A109', 'A074', 'A027', 'A116', 'A076', 'A079', 'A033',
	'A119', 'A081',
	'A038', 'A042', // 這是A區右上角那兩小桌

	/**
	 * B
	 */
	// 最上面橫排 由左往右
	'B001', 'B004', 'B051', 'B006', 'B054',
	'B059', 'B062',
	'B018', 'B067', 'B023', 'B071',
	// 過廁所門繼續往右
	'B027', 'B025', 'B079', 'B033', 'B031', 'B085',
	'B041', 'B093', 'B096', 'B102',
	// B區下半那排 一路往右
	'B108', 'B112',
	'B124', 'B142', 'B144',
	'B155', 'B160', 'B174', 'B178',

	/**
	 * C
	 */
	// 左上橫條開始 由左往右
	'C004', 'C006', 'C010', 'C012',
	'C019',
	'C030',
	// 中間大區塊的「有格板區」的左半邊 由上往下
	'C037', 'C042', 'C074', 'C077', 'C109', 'C113', 'C048', 'C083', 'C120',
	'C055', 'C060', 'C092', 'C095', 'C127', 'C131',
	'C066', 'C098', 'C134', 'C067', 'C104', 'C139',
	// 中間大區塊的「有格板區」的右半邊 由上往下
	'C146', 'C149', 'C182', 'C218', 'C156', 'C192', 'C188', 'C224', 'C227',
	'C164', 'C167', 'C199', 'C203', 'C236', 'C239',
	'C170', 'C205', 'C245', 'C176', 'C211', 'C248',
	// 下半無格板區 從左一路往右
	'C298', 'C300', 'C294', 'C291', 'C282',
	'C273', 'C271', 'C263', 'C264', 'C253', 'C255',
	// 剩下最左下跟右下了 由左往右吧
	'C311', 'C323', 'C335', 'C347',
]

console.log('nearVent:', nearVent.length)
let vent = _.difference(allSeatArrayFactory(), nearVent)

/**
 * toilet
 */
let nearToilet = []
nearToilet = nearToilet.concat(seatArrayFactory('A', 37, 44))
nearToilet = nearToilet.concat(seatArrayFactory('A', 81, 86))
nearToilet = nearToilet.concat(seatArrayFactory('A', 117, 122))
nearToilet = nearToilet.concat(seatArrayFactory('A', 153, 170))
nearToilet = nearToilet.concat(seatArrayFactory('A', 213, 224))
nearToilet = nearToilet.concat(seatArrayFactory('B', 1, 4))
nearToilet = nearToilet.concat(seatArrayFactory('B', 49, 52))

nearToilet = nearToilet.concat(seatArrayFactory('B', 17, 36))
nearToilet = nearToilet.concat(seatArrayFactory('B', 65, 90))

console.log('nearToilet:', nearToilet.length)
let toilet = _.difference(allSeatArrayFactory(), nearToilet)

/**
 * register
 */
let nearRegister = []
// 左下那台
nearRegister = nearRegister.concat(seatArrayFactory('A', 289, 292))
nearRegister = nearRegister.concat(seatArrayFactory('A', 171, 176))
// 中上那台
nearRegister = nearRegister.concat(seatArrayFactory('A', 25, 36))
nearRegister = nearRegister.concat(seatArrayFactory('C', 1, 12))
// 右邊那台
nearRegister = nearRegister.concat(seatArrayFactory('B', 144, 151))
nearRegister = nearRegister.concat(seatArrayFactory('B', 154, 155))
nearRegister = nearRegister.concat(seatArrayFactory('C', 73, 78))
nearRegister = nearRegister.concat(seatArrayFactory('C', 109, 114))

console.log('nearRegister:', nearRegister.length)
let register = _.difference(allSeatArrayFactory(), nearRegister)

/**
 * aisle
 */
let nearAisle = []
// A區中央南北大道
nearAisle = nearAisle.concat(seatArrayFactory('A', 87, 90))
nearAisle = nearAisle.concat(seatArrayFactory('A', 95, 96))
nearAisle = nearAisle.concat(seatArrayFactory('A', 101, 120))
nearAisle = nearAisle.concat(seatArrayFactory('A', 123, 125))
nearAisle = nearAisle.concat(seatArrayFactory('A', 128, 129))
nearAisle = nearAisle.concat(seatArrayFactory('A', 134, 135))
nearAisle = nearAisle.concat(seatArrayFactory('A', 140, 141))
nearAisle = nearAisle.concat(seatArrayFactory('A', 146, 147))
nearAisle = nearAisle.concat(seatArrayFactory('A', 152, 153))
nearAisle = nearAisle.concat(seatArrayFactory('A', 158, 159))
nearAisle = nearAisle.concat(seatArrayFactory('A', 164, 165)).concat(['A170'])
// A區左下角小區域
nearAisle = nearAisle.concat(seatArrayFactory('A', 171, 173)).concat(['A176'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 290, 291))
// A區右邊南北小道
nearAisle = nearAisle.concat(seatArrayFactory('A', 47, 53)).concat(['A004'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 9, 10)).concat(['A056'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 15, 16)).concat(['A057', 'A062'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 21, 22)).concat(['A063', 'A068'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 27, 36)).concat(['A069'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 72, 83)).concat(['A086'])
nearAisle = nearAisle.concat(seatArrayFactory('A', 37, 44))
// A區橫向小徑
nearAisle = nearAisle.concat(seatArrayFactory('A', 66, 77))
nearAisle = nearAisle.concat(seatArrayFactory('A', 102, 119))
// B區最上面橫向
nearAisle = nearAisle.concat(seatArrayFactory('B', 1, 2))
nearAisle = nearAisle.concat(seatArrayFactory('B', 4, 5))
nearAisle = nearAisle.concat(seatArrayFactory('B', 8, 9))
nearAisle = nearAisle.concat(seatArrayFactory('B', 12, 13))
nearAisle = nearAisle.concat(seatArrayFactory('B', 16, 17))
nearAisle = nearAisle.concat(seatArrayFactory('B', 20, 30))
nearAisle = nearAisle.concat(seatArrayFactory('B', 49, 84))
// B區中間連著那一整排，上下都小小走道所以全包吧！
nearAisle = nearAisle.concat(seatArrayFactory('B', 103, 150))
// C區上方橫排
nearAisle = nearAisle.concat(seatArrayFactory('C', 1, 3))
nearAisle = nearAisle.concat(seatArrayFactory('C', 6, 7))
nearAisle = nearAisle.concat(seatArrayFactory('C', 12, 13))
nearAisle = nearAisle.concat(seatArrayFactory('C', 18, 19))
nearAisle = nearAisle.concat(seatArrayFactory('C', 24, 25))
nearAisle = nearAisle.concat(seatArrayFactory('C', 30, 31))
nearAisle = nearAisle.concat(seatArrayFactory('C', 36, 45))
nearAisle = nearAisle.concat(seatArrayFactory('C', 73, 81))
nearAisle = nearAisle.concat(seatArrayFactory('C', 109, 118))
nearAisle = nearAisle.concat(seatArrayFactory('C', 145, 153))
nearAisle = nearAisle.concat(seatArrayFactory('C', 181, 189))
// C區中央縱向大道
nearAisle = nearAisle.concat(seatArrayFactory('C', 109, 118))
nearAisle = nearAisle.concat(seatArrayFactory('C', 123, 124))
nearAisle = nearAisle.concat(seatArrayFactory('C', 129, 136))
nearAisle = nearAisle.concat(seatArrayFactory('C', 141, 142))
nearAisle = nearAisle.concat(seatArrayFactory('C', 145, 153))
nearAisle = nearAisle.concat(seatArrayFactory('C', 156, 157))
nearAisle = nearAisle.concat(seatArrayFactory('C', 162, 163))
nearAisle = nearAisle.concat(seatArrayFactory('C', 166, 171))
nearAisle = nearAisle.concat(seatArrayFactory('C', 174, 175)).concat(['C180'])
// C區中間橫向小徑
nearAisle = nearAisle.concat(seatArrayFactory('C', 94, 99))
nearAisle = nearAisle.concat(seatArrayFactory('C', 130, 135))
nearAisle = nearAisle.concat(seatArrayFactory('C', 166, 171))
nearAisle = nearAisle.concat(seatArrayFactory('C', 202, 207))

// remove duplicates
nearAisle.sort()
nearAisle = _.sortedUniq(nearAisle)

console.log('nearAisle:', nearAisle.length)
let aisle = _.difference(allSeatArrayFactory(), nearAisle)

/************************/
/*		WriteJSON		*/
/************************/
let toWrite = {}

toWrite.laptop = {}
toWrite.laptop.laptopAllow = laptopAllow
toWrite.laptop.laptopForbidden = laptopForbidden
laptopAllow.sort()
laptopForbidden.sort()
console.log('laptopAllow:', laptopAllow.length)
console.log('laptopForbidden:', laptopForbidden.length)

toWrite.table = {}
toWrite.table.seats4 = seats4
toWrite.table.seats6 = seats6
toWrite.table.partition = partition
seats4.sort()
seats6.sort()
partition.sort()
console.log('seats4:', seats4.length)
console.log('seats6:', seats6.length)
console.log('partition:', partition.length)

toWrite.near = {}
toWrite.near.window = window
toWrite.near.wall = wall
window.sort()
wall.sort()
console.log('window:', window.length)
console.log('wall:', wall.length)

toWrite.away = {}
toWrite.away.toilet = toilet
toWrite.away.register = register
toWrite.away.aisle = aisle
toWrite.away.vent = vent
aisle.sort()
register.sort()
toilet.sort()
vent.sort()
console.log('vent:', vent.length)
console.log('toilet:', toilet.length)
console.log('register:', register.length)
console.log('aisle:', aisle.length)

fs.writeFile('src/seat-config.json', JSON.stringify(toWrite/* , null, 2 */), err => {
	if (err) throw err
	console.log('done generate file')
})

// below are some legacy things to read data.json from @kelly
// const data = require('./src/data.json')
//
// let laptopAllow = lodash.reduce(data, (res, val, key) => { if (val.laptop.usable) res.push(key); return res; }, [])
// let laptopForbidden = lodash.reduce(data, (res, val, key) => { if (val.laptop.usable === false) res.push(key); return res; }, [])
// let seats4 = lodash.reduce(data, (res, val, key) => { if (val.table.seat === 4) res.push(key); return res; }, [])
// let partition = lodash.reduce(data, (res, val, key) => { if (val.table.partition) res.push(key); return res; }, [])
// let window = lodash.reduce(data, (res, val, key) => { if (val.near.window) res.push(key); return res; }, [])
// let wall = lodash.reduce(data, (res, val, key) => { if (val.near.wall) res.push(key); return res; }, [])
// let toilet = lodash.reduce(data, (res, val, key) => { if (val.away.toilet) res.push(key); return res; }, [])
// let register = lodash.reduce(data, (res, val, key) => { if (val.away.register) res.push(key); return res; }, [])
// let aisle = lodash.reduce(data, (res, val, key) => { if (val.away.aisle) res.push(key); return res; }, [])
// let vent = lodash.reduce(data, (res, val, key) => { if (val.away.vent) res.push(key); return res; }, [])
