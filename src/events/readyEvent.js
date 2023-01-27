const { ActivityType } = require("discord.js");
const { checking } = require("../managers/checkManager.js");
const { checkingDraw } = require("../managers/drawCheckManager.js");
const { getter } = require("../utils/firebase/firebaseGuildApi.js");
const { getError, setError } = require("../utils/googleApi/forumApi");
const {
  getTutores,
  addTutorandoRow,
  addUsersRow,
} = require("../utils/googleApi/rankApi.js");

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
      if (guild.id == "726290600332230686") {
        /*const tutorandoRole = await guild.roles.cache.find(
          (role) => role.id === "846146794613243915"
        );
        tutorandoRole.members.forEach(async (member) => {
          await addTutorandoRow(
            755009417,
            member.id,
            member.user.username,
            member.nickname
          );
        });*/

        const tutorandoPlusRole = await guild.roles.cache.find(
          (role) => role.id === "846146794613243915"
        );
        addUsersRow(tutorandoPlusRole);

        /*await getTutores(429915779).then((tutores) => {
          tutores.forEach(async (t) => {
            const role = await guild.roles.cache.find(
              (role) => role.id === t.roleId
            );
            role.members.forEach(async (member) => {
              await addTutorandoRow(
                755009417,
                member.id,
                member.user.username,
                member.nickname
              );
            });
          });
        });*/
      }

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
