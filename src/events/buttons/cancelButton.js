const { array, removeElement } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");

module.exports = {
  customId: "cancel",
  async execute(interaction, client) {
    const { user } = interaction;
    const userId = user.id;

    const list = array();
    const obj = list.find((l) => l.userId == userId);
    if (obj == undefined) return;
    const int = obj.interaction;
    removeElement(obj);
    int.editReply({
      content: `${emojis["error"]} O envio foi cancelado com sucesso!`,
      components: [],
      files: [],
      ephemeral: true,
    });
  },
};
