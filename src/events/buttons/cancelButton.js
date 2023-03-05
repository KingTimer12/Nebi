const { getDraw, removeDraw } = require("../../database/handler/drawHandler");
const { emojis } = require("../../utils/emotes.json");

module.exports = {
  customId: "cancel",
  async execute(interaction, client) {
    const { user } = interaction;
    const userId = user.id;

    const drawObj = getDraw(userId)
    if (drawObj == undefined) return;
    const int = drawObj.interaction;
    removeDraw(userId)
    await int.editReply({
      content: `${emojis["error"]} O envio foi cancelado com sucesso!`,
      components: [],
      files: [],
      ephemeral: true,
    }).catch(console.log);
  },
};
