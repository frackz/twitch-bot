module.exports = {
    name: 'commands', // Event name
    async execute(channel, tags, message, self, client) {
        const data = JSON.parse(JSON.stringify(client.db.prepare('SELECT * FROM `commands` WHERE `channel` = ?').all(channel.replace("#",""))))
        var commands = ''
        for (const key in data){
            const currentData = JSON.parse(JSON.stringify(data[key]))
            if (data.length != parseInt(key)+1) {
                commands=commands+currentData.command+', '
            } else {
                commands=commands+currentData.command
            }
        }
        client.client.say(channel, '@'+tags.username+", list of all commands here: "+commands)
    }
}