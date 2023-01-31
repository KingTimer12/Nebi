const { Schema, model, SchemaTypes } = require("mongoose");

const GuildSchema = new Schema({
    guildId: {
        type: SchemaTypes.String,
        required: true,
    },
    guildName: SchemaTypes.String,
    coins: {
        type: SchemaTypes.Array
    },
});

module.exports = model('Guild', GuildSchema); 