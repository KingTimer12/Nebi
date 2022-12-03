require('dotenv').config()
const { REST, Routes } = require('discord.js');
const fs = require('fs');

module.exports = async (client) => {
    let comma = []
    let slashFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
    for (let file of slashFiles) {
        let commandSlash = require(`../commands/${file}`)
        client.commands.set(commandSlash.data.name, commandSlash)
        comma.push(commandSlash.data.toJSON())
    }
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try {
        console.log('Loading application commands...');
        await rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: comma });
        console.log('Application commands loaded');
    } catch (error) {
        console.error(error);
    }
}