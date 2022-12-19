const { array, add, removeElement } = require("../managers/drawManager");
const { getter } = require("../utils/firebase/firebaseGuildApi");
const { emojis } = require("../utils/emotes.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getData, createEvent } = require("../utils/firebase/firabaseDraw");
const { getNextSunday } = require("../utils/timerApi");

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

module.exports = {
  name: "Select Menu",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction, client) {
    if (!interaction.isStringSelectMenu()) return;
    const { customId } = interaction;

    var select = client.selects.get(customId);
    if (!select) return;

    try {
      await select.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "Ocorreu um erro ao executar esse selecionar!",
        ephemeral: true,
      });
    }
  },
};
