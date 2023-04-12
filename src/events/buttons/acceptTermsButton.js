const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojis } = require("../../utils/emotes.json");
const form = require('../../config/form.json')

let purpleHex = "#D000BA";

async function sendMessage(interaction, question, {type, customId}) {
  const embed = new EmbedBuilder()
    .setColor(purpleHex)
    .setTitle(question)
    .setTimestamp();
  const msg = await interaction.user.send({ embeds: [embed] });
  let check = undefined
  if (type == 'writer') {
    check = await awaitMessage(msg.channel);
  } else check = await awaitComponent(msg, customId);
  return check;
}

async function awaitMessage(channel) {
  const filter = (msg) => msg.content != "";
  const sendedMessage = channel
    .awaitMessages({ max: 1, time: 600_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { content: undefined, message: msgFirst };

      const m = msgFirst.content;
      if (m != undefined) response.content = m;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

async function awaitComponent(message, customId) {
  const filter = (interaction) => interaction.customId === customId;
  const interactionResult = message.awaitMessageComponent({filter, time: 600_000})
  return interactionResult;
}

module.exports = {
  customId: "acceptTerms",
  async execute(interaction, client) {
    await interaction.deferUpdate().then(async () => {
      const embed = new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle("Dados do Tutorando")
        .setTimestamp();
      interaction.user.send({ embeds: [embed] });

      let index = 0;
      while (form[index] != undefined) {
        const message = await sendMessage(interaction, question[index]);
        if (message == undefined) index = -1;

        index++;
      }
    });
  },
};
