const tmi = require('tmi.js')
const db = require('better-sqlite3')

const Database = new db('data.sqlite')

Database.exec('CREATE TABLE IF NOT EXISTS `commands` (`channel` varchar(255) NOT NULL, `command` varchar(255) NOT NULL, `content` varchar(255) NOT NULL)')

username = '' // Twitch username
password = '' // Aoth for twitch (https://twitchapps.com/tmi)

channels = ['Ninja'] // Channels the bot is gonna operate in.

const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: username,
        password: password
    },
    channels: channels
})

client.connect().catch(console.error)

client.on('message', (channel, tags, message, self) => {
    if (self) return;
    if (message.includes(">add")) {
        const c = channel.replace("#","")
        const splitted = message.split(" ")

        if (splitted[0] == null) {return}

        if (splitted[1] == null) {return client.say(channel, 'Need to enter command name.')}
        if (splitted[2] == null) {return client.say(channel, 'Need to give content to the command')}

        const content = message.split(splitted[1]+' ')[1]

        const data = Database.prepare('SELECT * FROM `commands` WHERE `channel` = ? AND `command` = ?').get(c, splitted[1])

        if (data != null) {return client.say(channel, 'Command already exist')} 

        const g = Database.prepare("INSERT INTO `commands` (`channel`, `command`, `content` ) VALUES (?, ?, ?)");
        g.run(c, splitted[1], content)

        client.say(channel, 'Success! Created a command named: '+splitted[1])
    } else if (message.includes(">remove")) {
        const c = channel.replace("#","")
        const splitted = message.split(" ")

        if (splitted[1] == null) {return client.say(channel, 'Need to enter a command you want to delete')}

        const data = Database.prepare('SELECT * FROM `commands` WHERE `channel` = ? AND `command` = ?').get(c, splitted[1])

        if (data != null) {
            Database.prepare('DELETE FROM `commands` WHERE `channel` = ? AND `command` = ?').run(c, splitted[1])
            return client.say(channel, 'Deleted command '+splitted[1])
        } else {
            return client.say(channel, "Command doesn't exist")
        }
    } else if (message.includes(">commands")) {
        const data = JSON.parse(JSON.stringify(Database.prepare('SELECT * FROM `commands` WHERE `channel` = ?').all(channel.replace("#",""))))
        var commands = ''
        for (const key in data){
            const currentData = JSON.parse(JSON.stringify(data[key]))
            console.log(data.length)
            console.log(parseInt(key)+1)
            if (data.length != parseInt(key)+1) {
                commands=commands+currentData.command+', '
            } else {
                commands=commands+currentData.command
            }
        }
        client.say(channel, '@'+tags.username+", list of all commands here: "+commands)

    }
    const data = Database.prepare('SELECT * FROM `commands` WHERE `channel` = ? AND `command` = ?').get(channel.replace("#",""), message)
    if (data != null) {
        return client.say(channel, data.content)
    }
})
