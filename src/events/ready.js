const { ActivityType } = require('discord.js');

const activities = [
  { type: ActivityType.Playing, name: 'meu jogo!' },
  { type: ActivityType.Listening, name: 'NovelCast' },
  { type: ActivityType.Watching, name: 'vídeos da Novel Brasil.' }
]

module.exports = {
  async createEvent(client) {
    console.log("Bot ready!");
    
    client.user.setActivity({ type: ActivityType.Playing, name: 'meu jogo!' })
    setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(randomActivity.name, { type: randomActivity.type });
    }, 60*1000);
  },
};
