const { ActivityType } = require("discord.js");
const { checking } = require("../managers/checkManager.js");
const { getError, setError } = require("../utils/googleApi/forumApi");
const { loadMongo } = require("../database/mongodb.js");
const { getChannel } = require("../database/manager/guildManager.js");
const {
  updateAllUsers,
  removeCooldowns,
} = require("../database/handler/userHandler.js");
const { load } = require("../handlers/emojiHandler.js");
const { geral1, geral2 } = require("../utils/json/topicChannel.json");
const { convertStringToEmoji } = require("../utils/convertEmoji.js");
const { createDrawEvent } = require("../database/manager/drawManager.js");
const { checkingDraw } = require("../managers/drawCheckManager.js");
const { checkingMember } = require("../managers/newMemberCheckManager.js");

const activities = [
  { type: ActivityType.Playing, name: "meu jogo!" },
  { type: ActivityType.Listening, name: "NovelCastBR" },
  { type: ActivityType.Watching, name: "vídeos da Novel Brasil." },
];

function extractString(template, initChar, finalChar) {
  let i = 0;
  let data = [];
  do {
    if (template[i] == initChar) {
      for (let j = i + 1; j < template.length; j++) {
        if (template[j] == finalChar) {
          data[data.length] = template.slice(i + 1, j);
          i = j + 1;
          break;
        }
      }
    }
  } while (++i < template.length);
  return data;
}

const setTopicChannel = async (guild, channelName, string) => {
  const id = await getChannel(guild, { channelName });
  if (id) {
    const geralChannel = guild.channels.cache.find(
      (chn) => chn.id === id
    );
    let rawText = string.replace("convert", "").replace("convert", "");
    extractString(rawText, "(", ")").forEach((result) => {
      rawText = rawText.replace(
        `(${result})`,
        convertStringToEmoji(result.replace("{count}", guild.memberCount))
      );
    });
    geralChannel.setTopic(rawText);
  }
};

module.exports = {
  name: "Ready",
  event: "ready",
  once: true,

  async createEvent(client) {
    console.log("Bot ready!");

    load(client);

    //Conectar ao banco de dados
    await loadMongo().then(() => console.log("Connected successfully"));

    //Atualizar os usuários no banco de dados
    setInterval(async () => await updateAllUsers(), 60 * 1000);
    setInterval(() => removeCooldowns(), 20 * 1000);

    for (const guild of client.guilds.cache.values()) {
      //Método para adicionar todos tutorando na planilha
      /*const role = guild.roles.cache.find(role => role.id == '846146794613243915')
      if (role) await addUsersRow(role)*/

      await setTopicChannel(guild, 'geral-1', geral1)
      await setTopicChannel(guild, 'geral-2', geral2)
      setInterval(async () => {
        await setTopicChannel(guild, 'geral-1', geral1)
        await setTopicChannel(guild, 'geral-2', geral2)
      }, 10 * 60 * 1000);

      const forumId = await getChannel(guild, { channelName: "forum" });
      const forumChannel = guild.channels.cache.find(
        (chn) => chn.id === forumId
      );

      await checkingMember(guild)
      setInterval(async () => await checkingMember(guild), 3600*1000)

      if (forumChannel != undefined) {
        await checkingDraw(guild);

        setInterval(async () => {
          await checkingDraw(guild);
        }, 30 * 60 * 1000);
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
