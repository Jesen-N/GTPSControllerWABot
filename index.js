const { create, Client } = require('@open-wa/wa-automate')
const datakun = require('./filedata/data')
const fs = require('fs-extra')
const yoi = JSON.parse(fs.readFileSync("./filedata/setting.json"))
const bro = JSON.parse(fs.readFileSync("./configbot.json"))

let {
  prefix,
  ownerGTPS
} = yoi

let {
  exefile,
  onlinetxt
} = bro

const isRunning = (query, cb) => {
  let platform = process.platform;
  let cmd = '';
  switch (platform) {
      case 'win32' : cmd = `tasklist`; break;
      case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
      case 'linux' : cmd = `ps -A`; break;
      default: break;
  }
  kill(cmd, (err, stdout, stderr) => {
      cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
  });
}

const start = (client = new Client()) => {
    console.log("Bot Telah Login")

    client.onStateChanged((state) => {
      console.log(color('[~>>]', 'red'), state)
      if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
  })

  client.onMessage(async message => {
    var msg = message.body.toLowerCase()
    //××
    const { type, id, from, t, sender, isGroupMsg, caption, chat } = message
    const args = message.body.slice(prefix.length).trim().split(/ +/g);
    const yeah = args.shift().toLowerCase();
    let { body } = message
    const sending = sender.id
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const isDev = ownerGTPS.includes(sending)
    body = (type === 'chat' && body.startsWith(prefix)) ? body : (caption.startsWith(prefix)) ? caption : ''
    //^^

    switch (yeah) {

    case 'ping':
      client.sendText(from, `Pong!`)
      break
    
    case 'test':
      if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
      client.sendText(from, 'anjay bisa')
      break
    
    case 'help':
      client.sendText(from, `GTPS Controller WA Bot\n\n*Command List:*\n[>] ${prefix}status\n[>] ${prefix}online \n[>] ${prefix} start\n[>] ${prefix}stop\n\n*Bot © By Jesen N*\nCredit: *GuckTubeYT*`)
      break

    case 'status':
      if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
      isRunning(exefile, (status) => {
        if (status == true)
        {
          client.reply(from, '📊 *Server Status* 📊\n\n Server Is *UP!*', id)
        }
        else
        {
          client.reply(from, '📊 *Server Status* 📊\n\n Server Is *DOWN!*', id)
        }
      })
      break

      case 'online':
        if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        fs.readFile(`${onlinetxt}`, (err, count) => {
          if (err)
          console.log(err)
          client.reply(from, "*Player Online :* " + count, id)
      })
      break

      case 'start':
        if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        if (!isDev) return client.reply(from, 'owner bang?', id)
        if (fs.existsSync(exefile))
        {
          exec(`start "${exefile}"`)
        client.reply("server now is up!")
        }
        else
        {
        client.reply(from, 'exe not found', id)
        }
      break

      case 'stop':
        if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        if (!isDev) return client.reply(from, 'owner bang?', id)
        {
        kill(`taskkill /f /im "${exefile}"`)
          client.reply(from, "Server Has Been Stopped!", id)
        }
      break

    }
});
}

create(datakun(true, start))
    .then((client) => start(client))
    .catch((err) => new Error(err))