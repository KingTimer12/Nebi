const { SlashCommandBuilder } = require("discord.js");
const {
  firstMessages,
  secondsMessages,
  thirdMessages,
  fourthMessages,
} = require("../messages/howWorksMessage");
const { firstRolesMessages, secondRolesMessages } = require("../messages/rolesMessage");
const { firstRankMessages, buttonFinalMessages } = require("../messages/testRankMessage");
const { getter } = require("../utils/firebaseApi");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gerar")
    .setDescription("Enviar mensagem customizada para o chat específico.")
    .addStringOption((option) =>
      option
        .setName("id-name")
        .setDescription("Escolha o nome do chat.")
        .setRequired(true)
        .addChoices(
          { name: "Cargos", value: "roles" },
          { name: "Como funciona", value: "how-works" },
          { name: "Classes", value: "rank" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("embed-number")
        .setDescription("Digite o número do embed.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { guild, options, guildId } = interaction;
    const name = options.get("id-name").value;
    const genericId = await getter(guildId, "channel", name);
    const channel = guild.channels.cache.find((chn) => chn.id === genericId);

    if (name === "how-works") {
      const embednumber = options.get("embed-number").value;
      if (embednumber == "1") firstMessages(channel);
      if (embednumber == "2") secondsMessages(channel);
      if (embednumber == "3") thirdMessages(channel);
      if (embednumber == "4") fourthMessages(channel);
    }

    if (name === "roles") {
      const embednumber = options.get("embed-number").value;
      if (embednumber == "1") secondRolesMessages(channel);
      if (embednumber == "2") firstRolesMessages(channel);
    }

    if (name === "rank") {
      const embednumber = options.get("embed-number").value;
      if (embednumber == "1") firstRankMessages(channel);
      if (embednumber == "2") buttonFinalMessages(channel);
    }

    interaction.reply({
      content: "Mensagem gerada com sucesso!",
      ephemeral: true,
    });
  },
};
