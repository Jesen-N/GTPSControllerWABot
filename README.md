<p align="center">
<img src="https://raw.githubusercontent.com/jesen-n/gtpscontrollerwabot/master/media/image.jpg" width="128" height="128"/>
</p>
<p align="center">
<a href="#"><img title="Whatsapp-Bot" src="https://img.shields.io/badge/Whatsapp Bot-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge"></a>
</p>

## Note

## Install
```bash
> npm install
> node index.js
```
##  Editing the file
Edit the required value in `botwaconfig.json`.
```json
{
    "prefix": "!",
    "ownerNumber": ["62895607019922@c.us", "628"],
    "exegtps": "server.exe",
    "player": "players",
    "world": "worlds",
    "playeronline": "playeronline.txt",
    "gemfolder": "gemdb",
    "nameserver": "GTPS"
}
```
## Features
```bash
> !start (start the server)
> !stop (stop the server)
> !count (get player & worlds size)
> !giverole <player> <number role> (give player role)
> !givelevel <player> <level> (give player level)
> !givegems <player> <amount> (give player gems)
> !changepass <player> <new pass> (change pass player)
> !delplayer (delete all players file)
> !delworld (delete all worlds file)
> !rollbackall (delete players & worlds file)
```

## Thanks to
- [WA-Automate](https://github.com/open-wa/wa-automate-nodejs)
- [YogaSakti](https://github.com/YogaSakti/imageToSticker)
- [GuckTubeYT](https://github.com/GuckTubeYT/GTPSControllerDiscordBot)


