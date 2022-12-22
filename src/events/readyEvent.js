const { ActivityType } = require("discord.js");
const { checking } = require("../managers/checkManager.js");
const { checkingDraw } = require("../managers/drawCheckManager.js");
const { add } = require("../managers/forumManager.js");
const { getter } = require("../utils/firebase/firebaseGuildApi.js");
const { getError, setError } = require("../utils/googleApi.js");

const activities = [
  { type: ActivityType.Playing, name: "meu jogo!" },
  { type: ActivityType.Listening, name: "NovelCastBR" },
  { type: ActivityType.Watching, name: "vídeos da Novel Brasil." },
];

module.exports = {
  name: "Ready",
  event: "ready",
  once: true,

  async createEvent(client) {
    console.log("Bot ready!");

    for (const guild of client.guilds.cache.values()) {
      const genericId = await getter(guild.id, "channel", "forum");
      const forumChannel = guild.channels.cache.find(
        (chn) => chn.id === genericId
      );

      if (forumChannel != undefined) {
        await checking(guild, forumChannel);
        await checkingDraw(guild);

        setInterval(async () => {
          await checkingDraw(guild);
          if (getError() == true) {
            setInterval(async () => {
              setError(false);
              await checking(guild, forumChannel);
            }, 10 * 60 * 1000);
          } else {
            await checking(guild, forumChannel);
          }
        }, 60 * 1000);
      }
    }

    client.user.setActivity({ type: ActivityType.Playing, name: "meu jogo!" });
    setInterval(() => {
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(randomActivity.name, {
        type: randomActivity.type,
      });
    }, 30 * 60 * 1000);
  },
};
