const { ActivityType } = require("discord.js");
const { checking } = require("../managers/checkManager.js");

const { getError, setError } = require("../utils/googleApi/forumApi");
const { loadMongo } = require("../database/mongodb.js");
const { getChannel } = require("../database/manager/guildManager.js");
const { updateAllUsers, removeCooldowns } = require("../database/handler/userHandler.js");

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

    //Conectar ao banco de dados
    await loadMongo().then(() => console.log('Connected successfully'))

    //Atualizar os usuários no banco de dados
    setInterval(async () => await updateAllUsers(), 60 * 1000);
    setInterval(() => removeCooldowns(), 20 * 1000);

    for (const guild of client.guilds.cache.values()) {
      //Método para adicionar todos tutorando na planilha
      /*const role = guild.roles.cache.find(role => role.id == '846146794613243915')
      if (role) await addUsersRow(role)*/

      const forumId = await getChannel(guild, {channelName:'forum'})
      const forumChannel = guild.channels.cache.find(
        (chn) => chn.id === forumId
      );

      if (forumChannel != undefined) {
        await checking(guild, forumChannel);
        //await checkingDraw(guild);

        setInterval(async () => {
          //await checkingDraw(guild);
          if (getError() == true) {
            setInterval(async () => {
              setError(false);
              await checking(guild, forumChannel);
            }, 10 * 60 * 1000);
          } else {
            await checking(guild, forumChannel);
          }
        }, 60 * 60 * 1000);
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
