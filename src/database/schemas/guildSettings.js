const { Schema, model } = require('mongoose');

const GuildSchema = Schema({
	guildId: String,
    guildName: String,
    channels: Array,
    roles: Array
});

module.exports = model('guilds', GuildSchema);