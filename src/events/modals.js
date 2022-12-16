const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { add, removeElement, array } = require("../managers/drawManager");
const { emojis } = require("../utils/emotes.json");
const {
  getWeek,
  createEvent,
  sendDraw,
  getData,
} = require("../utils/firebase/firabaseDraw");
const { uploadImg } = require("../utils/imgurApi");
const { getNextSunday, toMoment, unix } = require("../utils/timerApi");

async function awaitMessage(interaction) {
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
  name: "Modals",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction) {
    if (!interaction.isModalSubmit()) return;
    const { user, customId, fields } = interaction;
    const userId = user.id;
    if (customId == "modal-li") {
      const textName = fields.getTextInputValue("text-name");
      const link = fields.getTextInputValue("link");
      console.log(textName, link);
      return;
    }
    if (customId == "modal-md") {
      const drawName = fields.getTextInputValue("draw-name");
      const type = fields.getTextInputValue("type");
      let comments = fields.getTextInputValue("comments");

      if (comments.length > 1000) {
        comments = comments.slice(0, 1000);
      }

      interaction
        .reply({
          content: `${emojis["send"]} Envie a imagem que será enviada para o mural.`,
          fetchReply: true,
          ephemeral: true,
        })
        .then(async () => {
          const responseCollected = await awaitMessage(interaction);
          if (responseCollected != undefined) {
            setTimeout(
              async () => await responseCollected.message.delete(),
              90
            );
            let week = await getWeek();
            let data = undefined;
            if (week > 0) {
              data = await getData(week);
            } else {
              data = getNextSunday().getTime();
              await createEvent(1, data);
            }
            const url = responseCollected.url;
            add(week, userId, drawName, type, comments, url, interaction);

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

            interaction
              .editReply({
                content: msgFinal,
                files: [{ attachment: url, name: `${drawName}.png` }],
                components: [send],
                ephemeral: true,
              })
              .catch((err) => {});
          } else {
            interaction.editReply({
              content:
                emojis["error"] +
                " Você demorou demais para enviar o imagem! Use o comando `/enviar` novamente.",
              ephemeral: true,
            });
          }
        })
        .catch(console.error);
    }
    if (customId == "modal-md-edit") {
      const drawName = fields.getTextInputValue("draw-name");
      const type = fields.getTextInputValue("type");
      let comments = fields.getTextInputValue("comments");

      if (comments.length > 1000) {
        comments = comments.slice(0, 1000);
      }

      const list = array();
      const obj = list.find((l) => l.userId == userId);
      if (obj == undefined) return;
      const int = obj.interaction;
      const week = obj.week;

      await interaction.deferUpdate().then(() => {
        int
        .editReply({
          content: `${emojis["send"]} Envie a imagem que será enviada para o mural.`,
          fetchReply: true,
          components: [],
          files: [],
          ephemeral: true,
        })
        .then(async () => {
          const responseCollected = await awaitMessage(int);
          if (responseCollected != undefined) {
            setTimeout(
              async () => await responseCollected.message.delete(),
              90
            );
            let data = undefined;
            if (week > 0) {
              data = await getData(week);
            } else {
              data = getNextSunday().getTime();
              await createEvent(1, data);
            }
            const url = responseCollected.url;

            removeElement(obj);
            add(week, userId, drawName, type, comments, url, int);

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

            int
              .editReply({
                content: msgFinal,
                files: [{ attachment: url, name: `${drawName}.png` }],
                components: [send],
                ephemeral: true,
              })
              .catch((err) => {});
          } else {
            int.editReply({
              content:
                emojis["error"] +
                " Você demorou demais para enviar o imagem! Use o comando `/enviar` novamente.",
              ephemeral: true,
            });
          }
        });
      });
    }
  },
};
