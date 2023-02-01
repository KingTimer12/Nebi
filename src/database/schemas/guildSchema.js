const { Schema, model, SchemaTypes } = require("mongoose");

const GuildSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    guildName: String,
    channels: {
        type: Array,
        default: [{ channelName: String, channelId: String }]
    },
    roles: {
        type: Array,
        default: [{ roleName: String, roleId: String }]
    },
});

module.exports = model('Guild', GuildSchema); 