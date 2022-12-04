const { ActivityType } = require('discord.js');
const { checking } = require('../managers/checkManager.js');
const { add, array } = require('../managers/forumManager.js');
const { getter } = require('../utils/firebaseGuildApi.js');
const { listValues } = require("../utils/googleApi.js");

const activities = [
  { type: ActivityType.Playing, name: 'meu jogo!' },
  { type: ActivityType.Listening, name: 'NovelCast' },
  { type: ActivityType.Watching, name: 'vídeos da Novel Brasil.' }
]

module.exports = {
  name: 'Ready',
  event: 'ready',
  once: true,

  async createEvent(client) {
    console.log("Bot ready!");

    const guild = client.guilds.cache.find(guild => guild.id === '1046080828716896297')
    const genericId = await getter(guild.id, "channel", "forum");
    const forumChannel = guild.channels.cache.find(
      (chn) => chn.id === genericId
    );

    for (const rows of forumChannel.availableTags) {
      add(rows.name, rows.id)
    }

    await checking(guild, forumChannel)

    setInterval(async () => {
      await checking(guild, forumChannel)
    }, 30 * 1000);

    client.user.setActivity({ type: ActivityType.Playing, name: 'meu jogo!' })
    setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(randomActivity.name, { type: randomActivity.type });
    }, 30*60*1000);
  },
};
