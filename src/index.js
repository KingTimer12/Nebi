require('dotenv').config()
const {Client, Collection, GatewayIntentBits} = require('discord.js')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildMembers
]})
module.exports = client

client.commands = new Collection()
client.events = new Collection()

require(`./handlers/commands`)(client)
require(`./handlers/events`)(client)

client.login(process.env.BOT_TOKEN)