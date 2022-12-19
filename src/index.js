require('dotenv').config()
const {Client, Collection, GatewayIntentBits} = require('discord.js')
const { loadEvents } = require('./handlers/eventHandler')
const discordModals = require('discord-modals');
const { loadButton } = require('./handlers/buttonHandler');
const { loadSelect } = require('./handlers/selectHandler');

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
client.buttons = new Collection()
client.selects = new Collection()

require(`./handlers/commands`)(client)
loadEvents(client)
loadButton(client)
loadSelect(client)

client.login(process.env.BOT_TOKEN)