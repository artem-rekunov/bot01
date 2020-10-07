"use strict"
const TelegramBot = require('node-telegram-bot-api');
const validator = require('validator');

const main = require(__dirname+'/src/MAIN');

const token = require(__dirname+'/src/configs/credentials.json').telegram_token;
const helpMessage = require(__dirname+'/src/configs/helpMessage')

const Logger = require(__dirname+'/src/middleware/Logger');
const Authors = require(__dirname+'/src/middleware/Authors')
const prettier = require(__dirname+'/src/middleware/prettiMessager');
const fs = require('fs');

const bot = new TelegramBot(token, { polling: true });

let user = fs.readFileSync(__dirname+'/src/data/owner.json', 'utf-8')

let sleep;
let watcher;
console.log(" +++++ user +++++ ");
console.log(user);
console.log(" +++++ user +++++ ");
if (user) {
  console.log(`<<<<WATCH>>>>`);
  watcher = setInterval(WATCHER, 60*1000)
}

bot.on("message", async function (msg) { console.log("chatId ==> "+user);
  let REQ = msg.text || "WATCH"

  // if ( user && msg.text == "botHelp" ) {
  //   console.log('botHelp')
  //     bot.sendMessage(user, helpMessage).catch((error)=>Logger(error, "Bot, help.", "helpMessage", REQ ))
  //     return null

  // } else if ( user && msg.text == "Bot, get arr" ) {
  //   console.log('get arr')
  //   let _authors = Authors.get()
  //   _authors.length == 0 ? bot.sendMessage(user, 'no authors').catch((error)=>Logger(error, "Bot, get arr" , 'no authors',REQ))
  //   : _authors.map(author => {
  //     bot.sendMessage(user, author).catch((error)=>Logger(error, "Bot, get arr >> res.map author =>...", author,REQ ))
  //   })
  //   return null

  // } else if ( user && msg.text.match(/(Bot, for [\d])/g)) {
  //   console.log('for')
  //   let days = msg.text.replace(/[^\d]/g, '')
  //   if (days >= 10) {
  //     bot.sendMessage(user, 'Please stand by').catch((error)=>Logger(error, "FOR >> days >= 10 =>...", 'Please stand by',REQ ))
  //   }
  //   let res = await main("getLastAuthors",days)
  //   let set = new Set(res);
  //   res = [...set];
  //   res.map(author => {
  //     bot.sendMessage(user, author ).catch((error)=>Logger(error, "FOR >> res.map author =>...", author,REQ))
  //   })
  //   return null

  // } else if ( user && msg.reply_to_message) {
  //   switch (msg.text) {
  //     case "add" : {
  //       if (!validator.isEmail(msg.reply_to_message.text)) {
  //         let start = msg.reply_to_message.text.indexOf('<')
  //         let end = msg.reply_to_message.text.indexOf('>')
  //         let email = msg.reply_to_message.text.slice(start+1,end)

  //         if (validator.isEmail(email)) {
  //           let res = Authors.set(msg.reply_to_message.text)
  //           bot.sendMessage(user, res ).catch((error)=>Logger(error, "validator.isEmail(email 1)", res, REQ))

  //         } else if (!validator.isEmail(email)) {
  //           bot.sendMessage(user, 'Incorrect Email').catch((error)=>Logger(error,'Incorrect Email 1', 'Incorrect Email', REQ))
  //         }
  //       } else if (validator.isEmail(msg.reply_to_message.text)) {
  //         let res = Authors.set(msg.reply_to_message.text)
  //         bot.sendMessage(user, res ).catch((error)=>Logger(error, "validator.isEmail(email 2)", res,REQ))

  //       } else {
  //         bot.sendMessage(user, 'WHAT!?').catch((error)=>Logger(error,'Incorrect Email 2', 'Incorrect Email', REQ))
  //       }
  //     }
  //       break;
  //     case "del" : { let res = Authors.del(msg.reply_to_message.text)
  //       bot.sendMessage(user, res ).catch((error)=>Logger(error, "del", res, REQ))
  //     }
  //       break;
  //   }
  //   return null
  // } else if
  if ( msg.text.match(/sudo start/) ) {
    console.log('start')
    try {
      if (!user) {
        user = msg.chat.id;
        fs.writeFileSync(__dirname+'/src/data/owner.json',JSON.stringify(user))
      }
      if ( watcher == undefined ) {
        console.log(user+": user & chat.id :"+msg.chat.id);
        let min = msg.text.search(/[\d]+/)
        min <= -1 ? min = 1 : min = +msg.text.match(/[\d]+/)[0]
        console.log('min >>>',min)
        let minutes = min*60*1000
        watcher = setInterval(WATCHER, minutes)
        console.log('start')
        // bot.sendMessage(user, ``).catch((error)=>Logger(error, "START", `Please stand by`,REQ))
        let messages = await main() //! "watch"
            messages.map((message) => {
              message = prettier(message)
              bot.sendMessage(user, message).catch((error)=>Logger(error, 'WATCH1', message, REQ))
            })
      } else if ( watcher != undefined ) {
        // bot.sendMessage(user, "Already running..." )
        console.log("Already running...");
      }
    } catch (error) { console.log("<<< ERROR >>>",error) }
    return null
  } else if ( user && msg.text == "stop" ) {

    console.log("stop")
    bot.sendMessage(user, "bot stopped").catch((error)=>Logger(error, "STOP", 'bot stopped', REQ))
    clearInterval(watcher);
    watcher = undefined;
    return null
  }
})




async function WATCHER () {
  let hours = new Date().getHours()
  console.log('Watching....'+!(hours>8&&hours<21));
  new Date().toString()
  if (hours >= 21) {
    clearInterval(watcher)
    watcher = null;
    sleep = setInterval(SLEEP, 1000*60*60);
    console.log('SLEEP MODE: ON!');
    return null
  }

  try {
    let messages = await main()
     {
        console.log(' ===========>>> messages <<<=========== ');console.log(messages);console.log(' ===========>>> messages <<<=========== ')
        console.log(' ===========>>> messages length <<<==== ');console.log(messages.length); console.log(' ===========>>> messages length <<<==== ');
        console.log(" ===========>>>   user   <<<=========== ");console.log(user);console.log(" ===========>>>   user   <<<=========== ");
      }
    if (messages.length != 0) {
      messages.map((message)=>{
        message = prettier(message)
        bot.sendMessage(user, message)
      })
      return null

    } else if (messages.length == 0) {
      console.log( '>>>>>>>>>>>> Still watching... '+ new Date().toUTCString())
      return null
    }

    return null
  } catch (error) {
    Logger(error, "CATCH!")
    return null
  }
}



async function SLEEP() {
  let hours = new Date().getHours()
  console.log(`
    zzzz
  zzz
 zz
z
`);
console.log(`**********************************
hours: ${hours}
new Date(): new Date()
**********************************`);
  if (hours == 8) {
    console.log("SLEEP MODE: OFF!");
    clearInterval(sleep);
    sleep = null;
    watcher = setInterval(WATCHER, 60*1000)
  }
  return
}