const tmi = require('tmi.js')
const db = require('better-sqlite3')

const EventHandler = require('./handlers/EventHandler')
const CommandHandler = require('./handlers/CommandHandler')

username = ''
password = ''

channels = ['']

class Main {
    constructor() {
        this.db = new db('data.sqlite')
        this.client = new tmi.Client({options: { debug: true },identity: {username: username,password: password}, channels: channels})
        this.commands = {}
    }

    setup() {
        this.db.exec('CREATE TABLE IF NOT EXISTS `commands` (`channel` varchar(255) NOT NULL, `command` varchar(255) NOT NULL, `content` varchar(255) NOT NULL)')
        this.client.connect().catch(console.error)
        this.handler()
    }

    handler() {
        new EventHandler(this).load()
        new CommandHandler(this).load()
    }
}
new Main().setup()