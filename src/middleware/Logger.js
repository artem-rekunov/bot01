"use strict"
const fs = require('fs');

module.exports = function ( error, text, updata, req ) {
  if (!error) {
    error = "NULL"
  }
  // my perfect loger
  fs.appendFileSync('./test.log.js', `====================================
>>>>> ${ new Date().toUTCString() }
====================================
${ text }
|||||||||||error or msg|||||||||||
${ Object.entries(error) }
++++++++++++++updata++++++++++++++
${ updata }
--------------updata--------------
================req================
${ req }
================req================
`);

  return null
}