const { EmbedBuilder } = require("discord.js");
const { getChannel, getDataWeek, getEnable, getInfo, setDisable, addOrUpdateDraw, getWeek, listDraws } = require("../database/manager/guildManager");
const { toMoment, getNextSunday } = require("../utils/timerApi");

const checkingDraw = async (guild) => {
  if (guild == undefined) return;
  const currentDate = toMoment(Date.now());

  if (currentDate.weekday() == 0) {
    console.log("CHECKING DRAW...");

    let week = await getWeek(guild);
    if (week == 0) week = 1;
    let date = await getDataWeek(guild, week);
    if (!date) date = getNextSunday().getTime();

    if (date == undefined) return console.log("date's undefined");
    const eventDate = toMoment(date);
    
    if (eventDate.dayOfYear() == currentDate.dayOfYear()) {
      const drawChannelId = await getChannel(guild, {
        channelName: "draw-week",
      });
      if (drawChannelId == undefined) {
        console.log("DrawChannelId's undefined");
        return
      }
      const drawChannel = guild.channels.cache.find(
        (chn) => chn.id === drawChannelId
      );
      if (drawChannel == undefined) {
        console.log("DrawChannelId's undefined");
        return
      }
      const list = await listDraws(guild, week);
      console.log(list)
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
