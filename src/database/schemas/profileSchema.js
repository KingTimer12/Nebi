const { Schema, model } = require('mongoose');

const ProfileSchema = Schema({
	userId: String,
	xp: Number,
	level: Number,
    badges: Array,
    glows: Number,
    aboutMe: String,
    backgroundImage: String,
    xpBoost: Number
});

module.exports = model('users', ProfileSchema);