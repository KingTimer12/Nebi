const { EmbedBuilder } = require("discord.js");
const { getChannel, getDataWeek, getEnable, getInfo, setDisable, addOrUpdateDraw } = require("../database/manager/guildManager");
const {
} = require("../utils/firebase/firabaseDraw");
const { toMoment, getNextSunday } = require("../utils/timerApi");

const checkingDraw = async (guild) => {
  if (guild == undefined) return;
  const currentDate = toMoment(Date.now());

  if (currentDate.weekday() == 7) {
    console.log("CHECKING DRAW...");

    let week = obj.week;
    let date = await getDataWeek(guild, week);
    if (week == 0) week = 1;
    if (!date) date = getNextSunday().getTime();

    if (date == undefined) return console.log("date's undefined");
    const eventDate = toMoment(date);

    if (eventDate.dayOfYear() == currentDate.dayOfYear()) {
      const drawChannelId = await getChannel(guild, {
        channelName: "draw-week",
      });
      if (drawChannelId == undefined)
        return console.log("DrawChannelId's undefined");
      const drawChannel = guild.channels.cache.find(
        (chn) => chn.id === drawChannelId
      );
      if (drawChannel == undefined)
        return console.log("DrawChannel's undefined");
      const list = await listDraws(week);
      let embeds = [];
      for (const userId of list) {
        if (userId == "data") continue;
        const enable = await getEnable(guild, week, userId);
        if (enable == false) continue;
        const infoArray = await getInfo(guild, week, userId);
        for (const info of infoArray) {
          const msgComments =
            info.comments != undefined ? `Comentário: ${info.comments}` : "";
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

        await setDisable(guild, week, userId);
      }

      if (embeds.length) {
        await drawChannel
          .send({
            embeds: embeds,
          })
          .catch(console.log);
      }
    } else if (
      eventDate.dayOfYear() + 1 == currentDate.dayOfYear() &&
      currentDate.hours() == 00 &&
      currentDate.minutes() == 00
    ) {
      data = getNextSunday().getTime();
      await addOrUpdateDraw(guild, { week: week+1, data: data})
      //await createEvent(week + 1, data);
      console.log("[DrawEvent] Update event for next sunday.");
    }
  }
};

module.exports = { checkingDraw };
