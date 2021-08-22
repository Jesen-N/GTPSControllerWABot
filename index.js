/*/
This Bot Made By Jesen N#9071.
Special Thanks To GucktubeYT!

If you found bug, contact me on Discord: Jesen N#9071.
dont forget to star & follow!
/*/
const { create, Client } = require('@open-wa/wa-automate')
const data = require("./databotwa/data")
const config = require("./botwaconfig.json")
const fs = require("fs")
const path = require("path");
const { exec } = require("child_process")
const kill = require("child_process").exec
const bcrypt = require("bcrypt");

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  
  arrayOfFiles = arrayOfFiles || []
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
        arrayOfFiles.push(path.join(__dirname, dirPath, file))
    }
  })
  
  return arrayOfFiles
}
  
const convertBytes = function(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  
  if (bytes == 0) {
    return "n/a"
  }
  
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  
  if (i == 0) {
    return bytes + " " + sizes[i]
  }
  
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}
  
const getTotalSize = function(directoryPath) {
  const arrayOfFiles = getAllFiles(directoryPath)
  
  let totalSize = 0
  
  arrayOfFiles.forEach(function(filePath) {
    totalSize += fs.statSync(filePath).size
  })
  
  return convertBytes(totalSize)
}
  
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
  })
}

const start = async (client = new Client()) => {
    console.log('[SERVER] GTPSControllerBotWA Now Is Online!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Client]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. Auto Blokir.')
            .then(() => client.contactBlock(call.peerJid))
        }))
        //Command Here
        client.onMessage(async (message) => {
            const { from, id, sender, type, isGroupMsg, caption} = message
            const isOwner = config.ownerNumber.includes(sender.id)
            let { body } = message
            body = (type === 'chat' && body.startsWith(config.prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(config.prefix)) ? caption : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            
            if (command == "test") {
                return client.sendText(from, "Work!")
            }
            if (command == "help") {
                if (!isGroupMsg) return;
                return client.sendText(from, `*GTPSController WA Bot*\n*Prefix:* ${config.prefix}\n\nCommand:\n*!start (start the server)*\n*!stop (stop the server)*\n*!status (see the status server)*\n*!count (get player & worlds size)*\n*!giverole <player> <number role> (give player role)*\n*!givelevel <player> <amount> (give player level)*\n*!takelevel <player> <amount>*\n*!givegems <player> <amount> (give player gems)*\n*!changepass <player> <new pass> (change pass player)*\n*!delplayer (delete all players file)*\n*!delworld (delete all worlds file)*\n*!rollbackall (delete players & worlds file)*`)
            }
            if (command == "start") {
                if (!isGroupMsg) return;
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
                fs.access(config.exegtps, (err) => {
                    if (err) {
                    console.log(err)
                    return client.sendText(from, `${config.exegtps} not found!`)
                    }
                      exec(`start ${config.exegtps}`)
                    return client.reply(from, "Server now is UP!", id)
                })
            }
            if (command == "stop") {
                if (!isGroupMsg) return;
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
               {
                    kill(`taskkill /f /im ${config.exegtps}`)
                    return client.reply(from, "Server now is DOWN!", id)
                }
            }
            if (command == "status") {
                if (!isGroupMsg) return;
                fs.readFile(`${config.playeronline}`, (err, count) => {
                if (err) return console.log(err)
                isRunning(config.exegtps, (status) => {
                    if (status === true)
                    {
                      return client.reply(from, `📊 *Server Status* 📊\n\nServer Is *UP!*\n*Players Online:* ${count}\n\n*${config.nameserver} Status Server*`, id)
                    }
                    else
                    {
                      return client.reply(from, `📊 *Server Status* 📊\n\nServer Is *DOWN!*\n*Players Online: 0*\n\n*${config.nameserver} Status Server*`, id)
                    }
                })
              })
            }
            if (command == "giverole") {
                if (!isGroupMsg) return;
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
                const user = args[0]
                const role = args[1]
                if(!user) return client.reply(from, `Usage: ${config.prefix}giverole <playername> <role number>`, id);

                if(!role) return client.reply(from, `Usage: ${config.prefix}giverole <playername> <role number>`, id);

                if (!fs.existsSync(config.player)) {
                    return client.reply(from, "Player Folder not found!", id)
                }
                if (!fs.existsSync(config.player + "/" + user + ".json")) {
                return  client.reply(from, "Player Not Found!", id)
                }
                let playername1 = `./${config.player}/${args[0]}.json`
                let playername2 = require(playername1);
                const rolenum =  parseInt(role)

                playername2.adminLevel = rolenum;

                fs.writeFile(playername1, JSON.stringify(playername2), function writeJSON(err) {
                if (err) return console.log(err);
                return client.reply(from, `Role has been Gived!\nPlayer Name: ${args[0]}\nGive Role Number: ${args[1]}`, id);
                })
            }
            if (command == "givelevel") {
                if (!isGroupMsg) return;
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
                const user = args[0]
                const levels = args[1]
                if(!user) return client.reply(from, `Usage: ${config.prefix}givelevel <playername> <amount>`, id);

                if(!levels) return client.reply(from, `Usage: ${config.prefix}givelevel <playername> <amount>`, id);

                if (!fs.existsSync(config.player)) {
                    return client.reply(from, "Player Folder not found!", id)
                }
                if (!fs.existsSync(config.player + "/" + user + ".json")) {
                return  client.reply(from, "Player Not Found!", id)
                }
                let playername1 = `./${config.player}/${args[0]}.json`
                let playername2 = require(playername1);

                var contents = fs.readFileSync(playername1);
                var jsonContent = JSON.parse(contents);
                var newlev2 = parseInt(jsonContent.level)
                var levargs = parseInt(levels)
                newlev2 += levargs
                const levelss =  parseInt(newlev2)

                playername2.level = levelss;

                fs.writeFile(playername1, JSON.stringify(playername2), function writeJSON() {
                return client.reply(from, `Level has been Gived!\nPlayer Name: ${args[0]}\nGive Level: ${args[1]}\nTotal Level: ${playername2.level}`, id)
                })
            }
            if (command == "takelevel") {
                if (!isGroupMsg) return;
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
                const user = args[0]
                const levels = args[1]
                if(!user) return client.reply(from, `Usage: ${config.prefix}takelevel <playername> <amount>`, id);

                if(!levels) return client.reply(from, `Usage: ${config.prefix}takelevel <playername> <amount>`, id);

                if (!fs.existsSync(config.player)) {
                    return client.reply(from, "Player Folder not found!", id)
                }
                if (!fs.existsSync(config.player + "/" + user + ".json")) {
                return  client.reply(from, "Player Not Found!", id)
                }
                let playername1 = `./${config.player}/${args[0]}.json`
                let playername2 = require(playername1);

                var contents = fs.readFileSync(playername1);
                var jsonContent = JSON.parse(contents);
                var newlev2 = parseInt(jsonContent.level)
                var levargs = parseInt(levels)
                newlev2 -= levargs
                const levelss =  parseInt(newlev2)

                playername2.level = levelss;

                fs.writeFile(playername1, JSON.stringify(playername2), function writeJSON() {
                return client.reply(from, `Level has been Taked!\nPlayer Name: ${args[0]}\nTake Level: ${args[1]}\nTotal Level: ${playername2.level}`, id)
                })
            }
            if (command == "givegems") {
              if (!isGroupMsg) return;
              if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
              const user = args[0]
              const gems = args[1]
              if(!user) return client.reply(from, `Usage: ${config.prefix}givegems <playername> <amount>`, id);

              if(!gems) return client.reply(from, `Usage: ${config.prefix}givegems <playername> <amount>`, id);

              if (fs.existsSync(`./` + config.gemfolder + `/${args[0]}.txt`)) {

              if (!fs.existsSync(`./` + config.gemfolder + `/${args[0]}.txt`)) {
                return message.reply("gemdb folder not found!")
              }
              let gemdb2 = `./` + config.gemfolder + `/${args[0]}.txt`
              var contents1 = fs.readFileSync(gemdb2);
              var newgem3 = parseInt(contents1)
              var gemargs2 = parseInt(gems)
              newgem3 += gemargs2
              const gemssdb =  parseInt(newgem3)
                fs.writeFile(gemdb2, gemssdb.toString(), function() {
                  const rgemdb = fs.readFileSync(gemdb2)
                  return client.reply(from, `Gems has been Gived!\n\nof player named: ${args[0]}\nGems Amount: ${args[1]}\nTotal Gems: ${rgemdb}`, id)
                })
                return
              }
      
              if (!fs.existsSync(config.player)) {
                return client.reply(from, "Player Folder not found! Please set on config.json", id)
              }
      
              fs.access(`./` + config.player + `/${args[0]}.json`, fs.F_OK, (err) => {
                if (err) {
                  return  client.reply(from, "Player Not Found!", id)
              }
      
              let playername1 = `./` + config.player + `/${args[0]}.json`
              let playername2 = require(playername1);
              
              var contents = fs.readFileSync(playername1);
              var jsonContent = JSON.parse(contents);
              var newgem2 = parseInt(jsonContent.gems)
              var gemargs = parseInt(gems)
              newgem2 += gemargs
              const gemss =  parseInt(newgem2)
      
              playername2.gems = gemss;
      
              fs.writeFile(playername1, JSON.stringify(playername2), function writeJSON() {
                  return client.reply(from, `Gems has been Gived!\n\Player Name: ${args[0]}\nGems Amount: ${args[1]}\nTotal Gems: ${playername2.gems}`, id)
                })
              })
            }
            if (command == "changepass") {
                if (isGroupMsg) {
                    return client.reply(from, "use this command on pribadi chat!", id)
                }
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
                const user = args[0]
                const pass = args[1]
                if(!user) return client.reply(from, `Usage: ${config.prefix}changepass <playername> <new password>`, id);

                if(!pass) return client.reply(from, `Usage: ${config.prefix}changepass <playername> <new password>`, id);

                if (!fs.existsSync(config.player)) {
                    return client.reply(from, "Player Folder not found!", id)
                }
                if (!fs.existsSync(config.player + "/" + user + ".json")) {
                return  client.reply(from, "Player Not Found!", id)
                }
                let playername1 = `./${config.player}/${args[0]}.json`
                let playername2 = require(playername1);
                bcrypt.genSalt(12, function(err, salt) {
                    bcrypt.hash(pass, salt, function(err, hash) {
                    playername2.password = hash;
                    fs.writeFile(playername1, JSON.stringify(playername2), function writeJSON(err) {
                    if (err)
                        return console.log(err);
                    client.reply(from, `Changed password! of player named: ${args[0]}\nNew Pass: ${pass}`, id);
                    })
                    })
                })
            }
            if (command == "count") {
                if (!isGroupMsg) return;
                if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
                fs.readdir(config.player, (err, files) => {
                    if (err)
                    {
                      client.reply(from, "Player Folder Not Found", id)
                    }
                    fs.readdir(config.world, (err1, files1) => {
                      if (err1)
                    {
                      client.reply(from, "World Folder Not Found!", id)
                    }
                    const f1 = files.length;
                    const f2 = files1.length;
                    const sf1 = getTotalSize(config.player)
                    const sf2 = getTotalSize(config.world)
                  return client.reply(from, "Player Count = " + f1 + "\nPlayer Folder Size = " + sf1 + "\nWorlds Count = " + f2 + "\nWorlds Folder Size = " + sf2, id);
                  })
                })
            }
            if (command == "delplayer") {
              if (!isGroupMsg) return;
              if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
              const fileplayer = config.player;
                fs.readdir(fileplayer, (err, files1) => {
                  if (err)
                  {
                    return client.reply(from, "player folder not found!", id);
                  }
                  for (const file1 of files1) {
                    fs.unlink(path.join(fileplayer, file1), err => {
                      if (err)
                      {
                        return client.reply(from, "player folder not found!", id);
                      }
                    })
                  }
                })
              client.reply(from, 'Player & World has been Deleted! Restarting...', id);
                kill(`taskkill /f /im ${config.exegtps}`)
                fs.access(config.exegtps, (err) => {
                  if (err) return client.reply(from, config.exegtps + " Not Found!", id)
                  exec(`start ${config.exegtps}`)
                })
              client.reply(from, "Server has been Restarted!", id)
            }
            if (command == "delworld")   {
              if (!isGroupMsg) return;
              if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
              const fileworld = config.world;
                fs.readdir(fileworld, (err, files1) => {
                  if (err)
                  {
                    return client.reply(from, "world folder not found!", id);
                  }
                  for (const file1 of files1) {
                    fs.unlink(path.join(fileworld, file1), err => {
                      if (err)
                      {
                        return client.reply(from, "world folder not found!", id);
                      }
                    })
                  }
                })
              client.reply(from, 'Player has been Deleted! Restarting...', id);
                kill(`taskkill /f /im ${config.exegtps}`)
                fs.access(config.exegtps, (err) => {
                  if (err) return client.reply(from, config.exegtps + " Not Found!", id)
                  exec(`start ${config.exegtps}`)
                })
              client.reply(from, "Server has been Restarted!", id)
            }
            
            if (command == "rollbackall") {
              if (!isGroupMsg) return;
              if (!isOwner) return client.reply(from, "Sorry you not owner this GTPS", id)
              const fileworld = config.world;
              const fileplayer = config.player;
                fs.readdir(fileworld, (err, files1) => {
                  if (err)
                  {
                    return client.reply(from, "world folder not found!", id);
                  }
                  for (const file1 of files1) {
                    fs.unlink(path.join(fileworld, file1), err => {
                      if (err)
                      {
                        return client.reply(from, "world folder not found!", id);
                      }
                    })
                  }
                })
                fs.readdir(fileplayer, (err, files2) => {
                  if (err)
                  {
                    return client.reply(from, "player folder not found!", id);
                  }
                  for (const file2 of files2) {
                    fs.unlink(path.join(fileplayer, file2), err => {
                      if (err)
                      {
                        return client.reply(from, "player folder not found!", id);
                      }
                    })
                  }
                })
              client.reply(from, 'Player has been Deleted! Restarting...', id);
                kill(`taskkill /f /im ${config.exegtps}`)
                fs.access(config.exegtps, (err) => {
                  if (err) return client.reply(from, config.exegtps + " Not Found!", id)
                  exec(`start ${config.exegtps}`)
                })
              client.reply(from, "Server has been Restarted!", id)
            }
          })
}

create(data(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
