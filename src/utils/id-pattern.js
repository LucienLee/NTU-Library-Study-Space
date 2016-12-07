// See format definition at http://www.aca.ntu.edu.tw/aca2012/reg/services/serno.htm
const studentID = /^[BRDETACSYZPJFQHKMN]{1}\d{2}[1-9A-BE]{1}\d{3}\d{2}\d{1}$/ // last one digit for card replacement
const oldAlumnID = /^[A-Z]{1}[1-2]{1}[0-9]{8}\d{1}$/ // last one digit for card replacement
const newAlumnID = /^[A-Z]{1}\d{1}[1-2]{1}[0-9]{8}$/ // second one digit for card replacement

/*
	There are complicted and legecy pattern in the library system.
	For security issue, the library doesn't want to export all case of user ID and suggests verifing user in their API server.
	Hence, we just exploit a minimum length and carriage return as regex pattern.
	Please use copy and paste user ID to simulate the input from lasar card reader.
*/
const loose = /[A-Z0-9]+\r{1}$/

export { studentID, oldAlumnID, newAlumnID, loose }
