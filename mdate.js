const moment = require('moment-timezone');

const now = new Date();
// console.log(now, now.toISOString());

// moment().tz('Asia/Jakarta').format();
var makassar = moment.tz(now.toISOString(), 'Asia/Makassar').format();
console.log('Makassar', makassar);