const allEmojis = ['']

const load = (client) => {
    client.emojis.cache.forEach(emoji => {
        allEmojis.push(`${emoji.name} <:${emoji.identifier}>`)
    })
}

const getEmoji = (name) => {
    const emojiRaw = allEmojis.find(emoji => emoji.includes(name))
    if (emojiRaw) {
        const split = emojiRaw.split(' ')
        return split[1]
    }
    return undefined
}

module.exports = {load, getEmoji}