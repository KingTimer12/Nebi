const { User } = require('discord.js')

module.exports = Object.defineProperties(User.prototype, {
    glows: {
		value: 0,
		writable: true,
		enumerable: true,
	},
    xp: {
		value: 0,
		writable: true,
		enumerable: true,
	},
    level: {
		value: 0,
		writable: true,
		enumerable: true,
	},
    badges: {
		value: [],
		writable: true,
		enumerable: true,
	},
    aboutMe: {
		value: '',
		writable: true,
		enumerable: true,
	},
    xpBoost: {
		value: 0,
		writable: true,
		enumerable: true,
	},
    rankImage: {
		value: '',
		writable: true,
		enumerable: true,
	}
})