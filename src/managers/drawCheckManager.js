const { EmbedBuilder } = require("discord.js");
const {
  listDrawCache,
  removeCacheDraw,
} = require("../database/handler/drawHandler");
const {
  listUserDraw,
  saveUserDraw,
  resetUserDraw,
  createAndSaveUserDraw,
  fetchUserDraw,
} = require("../database/manager/drawManager");
const { getChannel } = require("../database/manager/guildManager");
const { toMoment } = require("../utils/timerApi");

const checkingDraw = async (guild) => {
  if (!guild) return;
  const currentDate = toMoment(Date.now());

  if (currentDate.weekday() == 0) {
    console.log("CHECKING DRAW...");

    const drawChannelId = await getChannel(guild, {
      channelName: "draw-week",
    });

    if (drawChannelId == undefined) {
      console.log("DrawChannelId's undefined");
      return;
    }
    const drawChannel = guild.channels.cache.find(
      (chn) => chn.id === drawChannelId
    );
    if (drawChannel == undefined) {
      console.log("Draw Channel's undefined");
      return;
    }

    await sendDraws(drawChannel)
  } else if (
    currentDate.weekday() == 1 &&
    currentDate.hours() == 0 &&
    currentDate.minutes() == 0
  ) {
    await resetUserDraw();
    console.log("[DrawEvent] Update event for next sunday.");
  }
};

const sendDraws = async (drawChannel) => {
  const list = await listUserDraw();
  let embeds = [];
  for (const obj of list) {
    for (const draw of obj.draws) {
      const msgComments =
        draw.description != undefined ? `Comentário: ${draw.description}` : "";
      embeds.push(
        new EmbedBuilder()
          .setColor("Orange")
          .setTitle(draw.name)
          .setDescription(
            `Tipo: **${draw.type}**\nAutor(a): <@!${obj.userId}>\n${msgComments}`
          )
          .setImage(draw.link)
      );
    }

    saveUserDraw(obj.userId);
  }

  if (embeds.length) {
    embeds.forEach(async (embed) => {
      await drawChannel
        .send({
          embeds: [embed],
        })
        .catch(console.log);
    });
  }
};

module.exports = { checkingDraw };