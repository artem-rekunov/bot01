"use strict"
module.exports = ([message, author]) => {
  let _message = `${author}\n====================================\n${message}`

  return _message
}