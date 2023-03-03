const { array, add, removeElement } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { updateDraw, getDraw } = require("../../database/handler/drawHandler");
const DrawModel = require("../../database/model/drawModel");

async function awaitMessage(interaction, filter) {
  //const filter = (msg) => interaction.user.id == msg.author.id;
  //const filter = (msg) => interaction.user.id == msg.author.id && msg.attachments.size > 0;
  const sendedMessage = interaction.channel
    .awaitMessages({ max: 1, time: 300_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = {
        content: undefined,
        url: undefined,
        message: msgFirst,
      };

      const text = msgFirst.content;
      if (text != undefined) response.content = text;

      const img = msgFirst.attachments.at(0);
      if (img != undefined) response.url = img.url;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

const updateAndSend = async (
  userId,
  drawName,
  type,
  comments,
  url,
  int
) => {

  updateDraw(userId, new DrawModel(int, drawName, type, url, comments))

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

  await int
    .editReply({
      content: msgFinal,
      files: [{ attachment: url, name: `${drawName}.png` }],
      components: [send],
      ephemeral: true,
    })
    .catch(console.log);
};

const editMessage = async (interaction, int, content) => {
  await interaction.deferUpdate().then(async () => {
    await int.editReply({
      content: `${emojis["send"]} ${content}`,
      files: [],
      components: [],
      ephemeral: true,
    }).catch(console.error);
  }).catch(console.error);
};

module.exports = {
  customId: "select-question",
  async execute(interaction) {
    const { values, user } = interaction;
    const userId = user.id;

    const selected = values[0];
    const drawObj = getDraw(userId)
    if (drawObj == undefined) return;
    const int = drawObj.interaction;

    const drawName = drawObj.name;
    const type = drawObj.type;
    const comments = drawObj.description;
    const url = drawObj.link;

    switch (selected) {
      case "title":
        await editMessage(interaction, int, "Digite qual será o novo título.").then(
          async () => {
            const collectedMessage = await awaitMessage(
              int,
              (msg) => interaction.user.id == msg.author.id
            );
            if (collectedMessage != undefined) {
              setTimeout(
                async () => await collectedMessage.message.delete(),
                90
              );
              const text = collectedMessage.content;
              updateAndSend(userId, text, type, comments, url, int);
            }
          }
        );
        break;
      case "type":
        await editMessage(interaction, int, "Digite qual será o novo tipo.").then(
          async () => {
            const collectedMessage = await awaitMessage(
              int,
              (msg) => interaction.user.id == msg.author.id
            );
            if (collectedMessage != undefined) {
              setTimeout(
                async () => await collectedMessage.message.delete(),
                90
              );
              const text = collectedMessage.content;
              updateAndSend(userId, drawName, text, comments, url, int);
            }
          }
        );
        break;
      case "comment":
        await editMessage(interaction, int, "Digite qual será o novo comentário.").then(
          async () => {
            const collectedMessage = await awaitMessage(
              int,
              (msg) => interaction.user.id == msg.author.id
            );
            if (collectedMessage != undefined) {
              setTimeout(
                async () => await collectedMessage.message.delete(),
                90
              );

              let text = collectedMessage.content;
              if (text.length > 1000) {
                text = text.slice(0, 1000);
              }

              updateAndSend(userId, drawName, type, text, url, int);
            }
          }
        );
        break;
      case "image":
        await editMessage(interaction, int, "Envie qual será a nova imagem.").then(
          async () => {
            const collectedMessage = await awaitMessage(
              int,
              (msg) => interaction.user.id == msg.author.id && msg.attachments.size > 0
            );
            if (collectedMessage != undefined) {
              setTimeout(
                async () => await collectedMessage.message.delete(),
                90
              );

              let text = collectedMessage.url;

              updateAndSend(userId, drawName, type, comments, text, int);
            }
          }
        );
        break;
      default:
        break;
    }
  },
};
