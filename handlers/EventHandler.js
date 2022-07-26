module.exports = class EventLoader {
    constructor(current) {
        this.db = current.db
        this.client = current.client
        this.commands = current.commands
    }

    load() {
        require('fs').readdirSync('./events').forEach(e => {
            if (!e.endsWith(".js")) return;
            const event = require('../events/'+e)
            if (event.name) {
                this.client.on(event.name, (...args) => event.execute(...args, this))
            }
        })
    }
}