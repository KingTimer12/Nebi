let cooldown = []

const addMusicCooldown = () => {
    cooldown.push('guildId')
}

const removeMusicCooldown = () => {
    cooldown = []
    console.log('remove cooldown')
}

const hasMusicCooldown = () => cooldown.includes('guildId')

module.exports = {addMusicCooldown, removeMusicCooldown, hasMusicCooldown}