module.exports = {
    name: 'remove', // Event name
    async execute(channel, tags, message, self, client) {
        const c = channel.replace("#","")
        const splitted = message.split(" ")

        if (splitted[1] == null) {return client.client.say(channel, 'Need to enter a command you want to delete')}

        const data = client.db.prepare('SELECT * FROM `commands` WHERE `channel` = ? AND `command` = ?').get(c, splitted[1])

        if (data != null) {
            client.db.prepare('DELETE FROM `commands` WHERE `channel` = ? AND `command` = ?').run(c, splitted[1])
            return client.client.say(channel, 'Deleted command '+splitted[1])
        } else {
            return client.client.say(channel, "Command doesn't exist")
        }
    }
}