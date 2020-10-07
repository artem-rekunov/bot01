const fs = require('fs');
const { google } = require('googleapis');
const parseMessage = require('gmail-api-parse-message');
const Validation = require(__dirname+'/middleware/Validation');
const getDate = require(__dirname+'/middleware/getDate');
const Authors = require(__dirname+'/middleware/Authors');

const CREDENTIALS_PATH = __dirname + '/configs/credentials.json'; //! Load client secrets from a local file.
const TOKEN_PATH = __dirname + '/configs/token.json';

let credentials = fs.readFileSync(CREDENTIALS_PATH, "utf-8")
    credentials = JSON.parse(credentials)

let [yesterday, today] = getDate(days=1)
let authors = Authors.get()
const query = `is:unread after:${yesterday} before:${today}`
console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${query}
authors: ${authors}
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)

async function authorize(_credentials) {

  let {
    client_secret,
    client_id,
    redirect_uris
  } = _credentials.installed

  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  let token = fs.readFileSync(TOKEN_PATH, "utf-8")
    token = await JSON.parse(token)
    oAuth2Client.setCredentials(token);

  return oAuth2Client
}

function listLabels(auth) {

  return new Promise((res, rej)=>{
    const gmail = google.gmail({
      version: 'v1',
      auth
    });

    //! get array of message id and message threadId (id != threadId)
    gmail.users.messages.list({
      'userId': 'me',
      'q': query
    }, (err, _res_list) => {

      if (err) {console.log('The API returned an error 2: ' + err);rej()}

      res(_res_list.data.messages)
    });
  })
}

async function getMessage (messageID, auth) {

  return new Promise( async (res, rej)=>{
    const gmail = google.gmail({
      version: 'v1',
      auth
    });

    await gmail.users.messages.get({
      'userId': "me",
      'id': messageID
    }, async (err, res_message) => {

      if (err) { console.log('The API returned an error 222: ' + err); rej() }
      let __parsedMessage = await parseMessage(res_message.data);
      console.log("????????????????", (authors.includes(__parsedMessage.headers.from)), __parsedMessage.headers.from);

      if (authors.includes(__parsedMessage.headers.from)) {
        await gmail.users.messages.modify({
          'userId': "me",
          'id': messageID,
          'addLabelIds': [],
          'removeLabelIds': ["UNREAD"]
        },(err, res)=> {

          if (err) console.log("from messages.modify err:", err)
          console.log("message changed successfully");
        });

        let _res = Validation(__parsedMessage)
        console.log(">>>>>>>>", _res);

        res([_res, __parsedMessage.headers.from])

      } else {
        console.log("else");

        res()
      }
    })
  })
}

async function asyncMap(res_list, auth) {
  let arr = []

  for await (let message of res_list) {
    arr.push( await getMessage(message.id, auth))
  }
  arr = arr.filter(element => !!element)

  return arr
}

function main (){

  return new Promise( async (res, rej)=>{
    let auth = await authorize(credentials)
    let res_list = await listLabels(auth)// console.log(res_list,"res_list");
    let res_array = await asyncMap(res_list, auth)// console.log(res_array,"res_array");

    res(res_array)
  })
}

module.exports = async function MAIN() {
  let messages = await main()
  console.log(messages, "messages");

  return messages
}