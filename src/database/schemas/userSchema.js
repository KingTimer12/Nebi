const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
    userId: {
        type: SchemaTypes.String,
        required: true,
    },
    username: SchemaTypes.String,
    coins: {
        type: SchemaTypes.Number,
        required: true,
        default: 0
    },
});

module.exports = model('User', UserSchema); 