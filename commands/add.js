module.exports = {
    name: 'add', // Event name
    async execute(channel, tags, message, self, client) {
        const c = channel.replace("#","")
        const splitted = message.split(" ")

        const tag = '@'+tags.username

        const name = splitted[1]
        const content = message.split(splitted[1]+' ')[1]

        if (name == null) {return client.client.say(channel, tag+', need to enter command name.')}
        if (content == null) {return client.client.say(channel, tag+', need to give content to the command')}

        const data = client.db.prepare('SELECT * FROM `commands` WHERE `channel` = ? AND `command` = ?').get(c, splitted[1])

        if (data != null) {return client.client.say(channel, tag+', command already exist')} 

        const g = client.db.prepare("INSERT INTO `commands` (`channel`, `command`, `content` ) VALUES (?, ?, ?)");
        g.run(c, name, content)

        client.client.say(channel, 'Success! Created a command named: '+name)
    }
}