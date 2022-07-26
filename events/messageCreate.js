module.exports = {
    name: 'message', // Event name
    async execute(channel, tags, message, self, client) {

        if (message[0] == '>') {
            const split = message.split(' ')
            const cmd = split[0].replace('>','')
            const cmds = client.commands

            if (cmds[cmd] != undefined) {
                require('../commands/'+cmds[cmd].file).execute(channel, tags, message, self, client)
            }
        }
        const data = client.db.prepare('SELECT * FROM `commands` WHERE `channel` = ? AND `command` = ?').get(channel.replace("#",""), message)
        if (data != null) {
            return client.client.say(channel, data.content)
        }
    }
}