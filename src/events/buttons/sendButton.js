const { array, removeElement, hasSend } = require("../../managers/drawManager");
const { getData, sendDraw } = require("../../utils/firebase/firabaseDraw");
const { uploadImg } = require("../../utils/imgurApi");
const { emojis } = require("../../utils/emotes.json");
const { toMoment } = require("../../utils/timerApi");

module.exports = {
  customId: "send",
  async execute(interaction, client) {
    const { user } = interaction;
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
      const date = await getData(obj.week);
      const dateInt = parseInt(date / 1000);

      const hasBool = await hasSend(obj.week)
      const dateString = hasBool ? ', hoje' : ` <t:${dateInt}:R>`

      await sendDraw(
        obj.week,
        obj.userId,
        obj.drawName,
        obj.type,
        obj.comments,
        dataImg.link
      ).then(() =>
        int.editReply({
          content: `${emojis["ready"]} A imagem foi salva e será enviada no mural${dateString}!`,
          components: [],
          files: [],
          ephemeral: true,
        }).catch(console.log)
      ).catch(console.log);
    });
  },
};
