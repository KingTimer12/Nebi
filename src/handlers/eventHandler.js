const loadEvents = async (client) => {

    const {loadFiles} = require('../utils/fileLoader.js')
    const ascii = require('ascii-table')
    const table = new ascii().setHeading('Nome', 'Eventos', 'Status')

    await client.events.clear()

    const files = await loadFiles('events')
    files.forEach(file => {
        const event = require(file)

        const execute = (...args) => event.createEvent(...args, client)
        client.events.set(event.event, execute)

        if (event.rest) {
            if (event.once) client.rest.once(event.event, execute)
            else client.rest.on(event.event, execute)
        } else {
            if (event.once) client.once(event.event, execute)
            else client.on(event.event, execute)
        }
        table.addRow(event.name, event.event, '✅')
    })

    return console.log(`${table.toString()}\nLoaded events.`)
}

module.exports = {loadEvents}