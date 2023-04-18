const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} = require("discord.js");
const { emojis } = require("../../utils/emotes.json");
const form = require("../../config/form.json");
const { addResponse, getResponses } = require("../../managers/formManager.js");

let purpleHex = "#D000BA";

async function sendMessage(interaction, question, { type, customId, options }) {
  const embed = new EmbedBuilder()
    .setColor(purpleHex)
    .setTitle(question)
    .setTimestamp();
  let msg = undefined;
  let check = undefined;
  if (type == "writer") {
    msg = await interaction.user.send({ embeds: [embed] });
    check = await awaitMessage(msg.channel);
  } else {
    let optionsWithEmoji = [];
    if (options == undefined) {
      return undefined;
    }
    //Variável "v" são os valores que tem no array "options"
    for (const v of options) {
      optionsWithEmoji.push({
        label: v.label,
        value: v.value,
        emoji: undefined,
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder("Selecione só uma opção")
        .setOptions(optionsWithEmoji)
    );
    msg = await interaction.user.send({ embeds: [embed], components: [row] });
    check = await awaitComponent(msg, customId);
  }
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
  const interactionResult = message
    .awaitMessageComponent({
      filter,
      time: 600_000,
      errors: ["time"],
    })
    .catch(console.error);
  return interactionResult;
}

const addCacheAndNextQuestion = async (userId, responseCache) => {
  addResponse(userId, responseCache);
};

module.exports = {
  customId: "acceptTerms",
  async execute(interaction, client) {
    const { userId } = interaction;
    await interaction.deferUpdate().then(async () => {
      const embed = new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle("Dados do Tutorando")
        .setTimestamp();
      interaction.user.send({ embeds: [embed] });

      let index = 0;
      let f = form[index];
      while (f != undefined) {
        f = form[index];
        if (f.classification != "data") break;
        const response = await sendMessage(interaction, f.question, {
          type: f.type,
          customId: f.customId,
          options: f.options,
        });

        if (response == undefined) break;

        let responseCache = "";
        if (response instanceof StringSelectMenuInteraction) {
          await response.update({ fetchReply: true });
          const value = response.values[0];
          responseCache = value;
        } else {
          responseCache = response.content;
        }

        addCacheAndNextQuestion(userId, responseCache);

        index++;
      }
      
    });
  },
};
