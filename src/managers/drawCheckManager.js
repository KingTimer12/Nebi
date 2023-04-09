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
const { uploadImg } = require("../utils/imgurApi");
const { toMoment } = require("../utils/timerApi");

const checkingDraw = async (guild) => {
  if (!guild) return;
  const currentDate = toMoment(Date.now());

  uploadCache();

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
    currentDate.hours() == 00 &&
    currentDate.minutes() == 00
  ) {
    await resetUserDraw();
    console.log("[DrawEvent] Update event for next sunday.");
  }
};

const uploadCache = () => {
  const list = listDrawCache();
  if (!list.size) return;
  list.forEach(async (userId, draw) => {
    let drawsCurrent = [];
    const userDraw = await fetchUserDraw(userId);
    if (userDraw && userDraw.draws) drawsCurrent = userDraw.draws;

    let description = draw.description == null ? "no" : draw.description;
    if (description.length > 10) {
      description = description.slice(0, 10);
    }

    let dataImg = undefined;
    try {
      dataImg = await uploadImg(draw.link, draw.name, description);
    } catch (error) {
      console.error(error);
    }
    if (!dataImg) {
      return;
    }

    const link = `${dataImg.link}`;
    console.log(link);
    if (!link.startsWith("https://i.imgur.com")) {
      return;
    }
    removeCacheDraw(userId);
    const drawResult = {
      name: draw.name,
      type: draw.type,
      link: link,
      description: draw.description,
    };

    drawsCurrent.push(drawResult);
    await createAndSaveUserDraw(user, drawsCurrent).catch(console.error);

    if (currentDate.weekday() != 0) {
      await sendDraws()
    }
  });
};

const sendDraws = async (drawChannel) => {
  const list = await listUserDraw();
  let embeds = [];
  for (const obj of list) {
    for (const draw of obj.draws) {
      if (!draw.link.startsWith("https://i.imgur.com")) continue;
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
