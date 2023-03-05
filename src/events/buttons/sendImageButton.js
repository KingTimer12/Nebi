const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { getDraw, updateDraw, removeDraw } = require("../../database/handler/drawHandler");
const DrawModel = require("../../database/model/drawModel");
const { emojis } = require("../../utils/emotes.json");

async function awaitImage(interaction) {
  const filter = (msg) =>
    interaction.user.id == msg.author.id && msg.attachments.size > 0;
  const sendedMessage = interaction.channel
    .awaitMessages({ max: 1, time: 300_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { url: undefined, message: msgFirst };

      const img = msgFirst.attachments.at(0);
      if (img != undefined) response.url = img.url;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

module.exports = {
  customId: "send-img",
  async execute(interaction) {
    const { user } = interaction;
    const userId = user.id;

    const draw = getDraw(userId)
    if (draw == undefined) return;
    const int = draw.interaction;

    const drawName = draw.name;
    const type = draw.type;
    const comments = draw.description;

    return await interaction.deferUpdate().then(async () => {
      await int
      .editReply({
        content: `${emojis["send"]} Envie a imagem que será enviada para o mural. Não use links, envie como arquivo de imagem.`,
        fetchReply: true,
        components: [],
        files: [],
        ephemeral: true,
      })
      .then(async () => {
        const responseCollected = await awaitImage(int);
        if (responseCollected != undefined) {
          setTimeout(async () => await responseCollected.message.delete().catch(console.log), 90);

          const url = responseCollected.url;

          updateDraw(userId, new DrawModel(int, drawName, type, url, comments))

          if (drawName != undefined && type != undefined) {
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
              .catch(console.log);
          } else {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("send-img")
                .setEmoji({ id: "1051884168977584139", name: "ready" })
                .setLabel("Enviar imagem")
                .setDisabled(true)
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("send-info")
                .setEmoji({ id: "1051884167782219776", name: "error" })
                .setLabel("Enviar informações")
                .setStyle(ButtonStyle.Danger)
            );

            await int.editReply({
              fetchReply: true,
              components: [row],
              ephemeral: true,
            }).catch(console.error);
          }
        } else {
          removeDraw(userId)
          await int.editReply({
            content:
              emojis["error"] +
              " Você demorou demais para enviar o imagem! Use o comando `/mural enviar` novamente.",
            ephemeral: true,
          }).catch(console.error);
        }
      });
    })
  },
};
