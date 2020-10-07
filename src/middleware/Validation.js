"use strict"
const htmlToText = require('./html_to_text');

module.exports = function Validation (message) {
  if (message.textPlain) {

    let _message = message.textPlain
    // console.log(!!_message); console.log('(message.textPlain)')
    return LengthCheck(_message)

  } else if (message.textHtml) {

    let _message = htmlToText(message.textHtml)
      console.log(_message)
      _message = _message.split(/\n/).map(str => str.trim())
      _message = _message.join(`
`)
      console.log(_message)
      // console.log(!!_message); console.log("message.textHtml")
      return LengthCheck(_message)

  } else if (!!message.textHtml&&!!message.textPlain) { console.log(message)

    console.log('NULL')
    return ['bad message!!!(((', message]

  }
}

function LengthCheck (message) {

  if (message.length <= 4089) {
    // console.log(!!message); console.log('message.length <= 4089')
    return message

  } else if (message.length >= 4090) {
    // console.log(!!message); console.log('message.length >= 4089')
    return _Slicer(message)
  }
}

function _Slicer (message) {

  let messages = []

  const _strike = message.match(/([\w\W]{4000}){1}/m)

  if (!!_strike) {
    const _NEWSTR = message.slice(_strike[0].length, -1)
    messages.push(_strike[0])
    return _Slicer(_NEWSTR)
  }

  messages.push(message)
  // console.log(!!messages); console.log(messages); console.log('ERORR in slicer');

  return messages
}