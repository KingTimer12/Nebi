require('dotenv').config()
const {Client, Collection, GatewayIntentBits} = require('discord.js')
const { loadEvents } = require('./handlers/eventHandler')
const discordModals = require('discord-modals');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildMembers
]})
discordModals(client);
module.exports = client

client.commands = new Collection()
client.events = new Collection()

require(`./handlers/commands`)(client)
loadEvents(client)
//require(`./handlers/events`)(client)

client.login(process.env.BOT_TOKEN)