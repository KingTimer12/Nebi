const { array, removeElement, hasSend } = require("../../managers/drawManager");
const { getData, sendDraw } = require("../../utils/firebase/firabaseDraw");
const { uploadImg } = require("../../utils/imgurApi");
const { emojis } = require("../../utils/emotes.json");
const { toMoment, getNextSunday } = require("../../utils/timerApi");
const {
  addOrUpdateDraw,
  getMembers,
  getWeek,
  getDataWeek,
} = require("../../database/manager/guildManager");

module.exports = {
  customId: "send",
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const userId = user.id;

    const list = array();
    const obj = list.find((l) => l.userId == userId);
    if (obj == undefined) return;
    const int = obj.interaction;

    removeElement(obj);

    let comments = obj.comments == null ? "no" : obj.comments;
    if (comments.length > 10) {
      comments = comments.slice(0, 10);
    }
    await uploadImg(obj.url, obj.drawName, comments).then(async (dataImg) => {
      let week = obj.week;
      let date = await getDataWeek(guild, week);
      if (week == 0) week = 1;
      if (!date) date = getNextSunday().getTime();

      const dateInt = parseInt(date / 1000);

      const hasBool = await hasSend(week);
      const dateString = hasBool ? ", hoje" : ` <t:${dateInt}:R>`;

      const draw = {
        drawName: obj.drawName,
        type: obj.type,
        comments: obj.comments,
        url: dataImg.link,
      };

      let draws = [];

      let members = await getMembers(guild, week);
      if (members) {
        for (const member of members) {
          if (member.userId == obj.userId) {
            draws = member.draws;
            break;
          }
        }
        draws.push(draw);

        members.push();
      } else {
        members = [
          {
            userId: userId,
            enable: true,
            draws: [draw],
          },
        ];
      }

      await addOrUpdateDraw(guild, { week: week, data: date, members: members })
        .then(() =>
          int
            .editReply({
              content: `${emojis["ready"]} A imagem foi salva e será enviada no mural${dateString}!`,
              components: [],
              files: [],
              ephemeral: true,
            })
            .catch(console.log)
        )
        .catch(console.log);
    });
  },
};
