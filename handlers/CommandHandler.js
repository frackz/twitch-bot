module.exports = class EventLoader {
    constructor(current) {
        this.db = current.db
        this.client = current.client
        this.commands = current.commands
    }

    load() {
        require('fs').readdirSync('./commands').forEach(e => {
            if (!e.endsWith(".js")) return;
            const event = require('../commands/'+e)
            if (event.name) {
                this.commands[event.name] = {
                    file: e                
                }
            }
        })
    }
}