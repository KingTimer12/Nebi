const fs = require('fs');

const events = {
    "ready.js": "ready",
    "newMember.js": "guildMemberAdd",
    "slashCreate.js": "interactionCreate",
    "buttons.js": "interactionCreate",
    "selectMenu.js": "interactionCreate"
}

module.exports = (client) => {
    const eventFiles = fs.readdirSync(`./src/events`).filter(file => file.endsWith('.js'))

    console.log('Loading events register...');
    for (let file of eventFiles) {
        let event = require(`../events/${file}`)
        client.events.set(events[file], event)
        client.on(events[file], (data) => {
            event.createEvent(data, client)
        })
    }
    console.log('Events loaded');
}