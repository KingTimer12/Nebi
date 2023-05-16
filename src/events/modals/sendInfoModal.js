const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getDraw, updateDraw } = require("../../database/handler/drawHandler");
const DrawModel = require("../../database/model/drawModel");

module.exports = {
  customId: "modal-md",
  async execute(interaction) {
    const { user, fields } = interaction;
    const userId = user.id;

    const drawName = fields.getTextInputValue("drawName");
    const type = fields.getTextInputValue("drawType");
    let comments = fields.getTextInputValue("drawDescription");

    const draw = getDraw(userId);
    if (draw == undefined) return;
    const int = draw.interaction;

    const url = draw.link;

    updateDraw(userId, new DrawModel(int, drawName, type, url, comments));

    return await interaction
      .deferUpdate()
      .then(async () => {
        if (url == undefined) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("send-img")
              .setEmoji({ id: "1051884167782219776", name: "error" })
              .setLabel("Enviar imagem")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("send-info")
              .setEmoji({ id: "1051884168977584139", name: "ready" })
              .setLabel("Enviar informações")
              .setDisabled(true)
              .setStyle(ButtonStyle.Success)
          );

          await int
            .editReply({
              fetchReply: true,
              components: [row],
              ephemeral: true,
            })
            .catch(console.error);
        } else {
          const msgComments =
            comments != undefined ? `${comments}` : "~~vazio~~";
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

          await int
            .editReply({
              content: msgFinal,
              files: [{ attachment: url, name: `${drawName}.png` }],
              components: [send],
              ephemeral: true,
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  },
};
