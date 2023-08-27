const { Schema, model } = require('mongoose');

const GuildSchema = Schema({
	userId: String,
    data: String,
    messagesId: Array
});

module.exports = model('forms', GuildSchema);