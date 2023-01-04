const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { array } = require("../../managers/drawManager");

module.exports = {
  customId: "back",
  async execute(interaction, client) {
    const { user } = interaction;
    const userId = user.id;
    
    const list = array();
    const obj = list.find((l) => l.userId == userId);
    if (obj == undefined) return;

    const comments = obj.comments;
    const drawName = obj.drawName;
    const type = obj.type;
    const url = obj.url;

    const int = obj.interaction;

    const msgComments = comments != undefined ? `${comments}` : "~~vazio~~";
    let msgFinal =
      `Veja se todas as informações estão corretas. Caso estejam, clique no botão **enviar**.\n` +
      `Houve algum erro? Clique em **editar** para corrigir.\n\n` +
      `Título: ${drawName}\nTipo: ${type}\nComentário: ${msgComments}\nImagem:`;

    const send = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("send")
        .setEmoji({ id: "1051884166276460604", name: "send" })
        .setLabel("Enviar")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("edit")
        .setEmoji("✏️")
        .setLabel("Editar")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cancel")
        .setEmoji({ id: "1051884167782219776", name: "error" })
        .setLabel("Cancelar")
        .setStyle(ButtonStyle.Danger)
    );
    return await interaction.deferUpdate().then(() => {
      int
        .editReply({
          content: msgFinal,
          files: [{ attachment: url, name: `${drawName}.png` }],
          components: [send],
          ephemeral: true,
        })
        .catch(console.log);
    });
  },
};
