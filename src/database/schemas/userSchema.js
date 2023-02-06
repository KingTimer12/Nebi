const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    glows: {
        type: Number,
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    wallpaper: {
        type: String,
        required: true,
        default: 'https://i.imgur.com/H1GXNG4.jpg'
    },
    badges: Map,
});

module.exports = model('User', UserSchema); 