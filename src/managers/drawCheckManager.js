const { EmbedBuilder } = require("discord.js");
const {
  getWeek,
  getData,
  createEvent,
  listDraws,
  getInfo,
  setEnable,
  getEnable,
} = require("../utils/firebase/firabaseDraw");
const { getter } = require("../utils/firebase/firebaseGuildApi");
const { toMoment, getNextSunday } = require("../utils/timerApi");

const checkingDraw = async (guild) => {
  console.log("CHECKING DRAW...");
  const week = await getWeek();
  let data = undefined;
  if (week > 0) {
    data = await getData(week);
  } else {
    data = getNextSunday().getTime();
    await createEvent(1, data);
  }
  if (data == undefined) return console.log("data's undefined");
  const momentData = toMoment(data);
  const momentDate = toMoment(Date.now());

  const drawChannelId = await getter(guild.id, "channel", "draw-week");
  if (drawChannelId == undefined) console.log("DrawChannelId's undefined");
  const drawChannel = guild.channels.cache.find(
    (chn) => chn.id === drawChannelId
  );
  if (drawChannel == undefined) console.log("DrawChannel's undefined");
  const list = await listDraws(week);
  let embeds = [];
  for (const userId of list) {
    if (userId == "data") continue;
    const enable = await getEnable(week, userId)
    if (enable == false) continue
    const infoArray = await getInfo(week, userId);
    for (const info of infoArray) {
      const msgComments = info.comments != undefined ? `Comentário: ${info.comments}` : ""
      embeds.push(
        new EmbedBuilder()
          .setColor("Random")
          .setTitle(info.drawName)
          .setDescription(
            `Tipo: **${info.type}**\nAutor(a): <@!${userId}>\n${msgComments}`
          )
          .setImage(info.url)
      );
    }
    //testar o enable
    await setEnable(week, userId, false)
  }

  if (embeds.length) {
    drawChannel.send({
      embeds: embeds,
    });
  }

  /*drawChannel.send({
          content: `Titulo: ${info.drawName}\nTipo: ${info.type}\nComentários: ${info.comments}`,
          files: [{ attachment: info.url, name: `${info.drawName}.png` }],
        });*/

  /*if (momentData.dayOfYear() == momentDate.dayOfYear()) {
    const drawChannelId = await getter(guild.id, "channel", "draw-week");
    if (drawChannelId == undefined) console.log("DrawChannelId's undefined");
    const drawChannel = guild.channels.cache.find(
      (chn) => chn.id === drawChannelId
    );
    if (drawChannel == undefined) console.log("DrawChannel's undefined");
    const list = await listDraws(week)
    
  } else if (momentDate.dayOfYear() == (momentData.dayOfYear()+1)) {
    await createEvent(week+1, getNextSunday(data))
  }*/
};

module.exports = { checkingDraw };
