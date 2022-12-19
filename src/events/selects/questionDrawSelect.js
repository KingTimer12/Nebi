const { array, add, removeElement } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getData, createEvent } = require("../../utils/firebase/firabaseDraw");
const { getNextSunday } = require("../../utils/timerApi");

const find = (userId) => {
  const list = array();
  return list.find((l) => l.userId == userId);
};

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
  week,
  userId,
  drawName,
  type,
  comments,
  url,
  int,
  obj
) => {
  let data = undefined;
  if (week > 0) {
    data = await getData(week);
  } else {
    data = getNextSunday().getTime();
    await createEvent(1, data);
  }
  removeElement(obj);
  add(week, userId, drawName, type, comments, url, int);

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

  int
    .editReply({
      content: msgFinal,
      files: [{ attachment: url, name: `${drawName}.png` }],
      components: [send],
      ephemeral: true,
    })
    .catch(console.log);
};

const editMessage = async (interaction, int, content) => {
  await interaction.deferUpdate().then(() => {
    int.editReply({
      content: `${emojis["send"]} ${content}`,
      files: [],
      components: [],
      ephemeral: true,
    });
  });
};

module.exports = {
  customId: "select-question",
  async execute(interaction, client) {
    const { member, guildId, guild, values, user } = interaction;
    const userId = user.id;

    const selected = values[0];
    const obj = find(userId);
    if (obj == undefined) return;
    const int = obj.interaction;
    const week = obj.week;

    const drawName = obj.drawName;
    const type = obj.type;
    const comments = obj.comments;
    const url = obj.url;

    switch (selected) {
      case "title":
        editMessage(interaction, int, "Digite qual será o novo título.").then(
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
              updateAndSend(week, userId, text, type, comments, url, int);
            }
          }
        );
        break;
      case "type":
        editMessage(interaction, int, "Digite qual será o novo tipo.").then(
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
              updateAndSend(week, userId, drawName, text, comments, url, int);
            }
          }
        );
        break;
      case "comment":
        editMessage(interaction, int, "Digite qual será o novo comentário.").then(
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

              updateAndSend(week, userId, drawName, type, text, url, int);
            }
          }
        );
        break;
      case "image":
        editMessage(interaction, int, "Envie qual será a nova imagem.").then(
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

              updateAndSend(week, userId, drawName, type, comments, text, int, obj);
            }
          }
        );
        break;
      default:
        break;
    }
  },
};
