const { SlashCommandBuilder } = require("discord.js");
const {
  firstMessages,
  secondsMessages,
  thirdMessages,
  fourthMessages,
} = require("../messages/howWorksMessage");
const {
  firstRolesMessages,
  secondRolesMessages,
} = require("../messages/rolesMessage");
const {
  firstRankMessages,
  buttonFinalMessages,
} = require("../messages/testRankMessage");
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

  dev: true,

  async execute(interaction) {
    const { guild, options, guildId } = interaction;
    const name = options.get("id-name").value;
    const genericId = await getter(guildId, "channel", name);
    const channel = guild.channels.cache.find((chn) => chn.id === genericId);
    var error = false;

    if (name === "how-works") {
      const embednumber = options.get("embed-number").value;
      if (embednumber == "1")
        firstMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
      if (embednumber == "2")
        secondsMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
      if (embednumber == "3")
        thirdMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
      if (embednumber == "4")
        fourthMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
    }

    if (name === "roles") {
      const embednumber = options.get("embed-number").value;
      if (embednumber == "1")
        secondRolesMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
      if (embednumber == "2")
        firstRolesMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
    }

    if (name === "rank") {
      const embednumber = options.get("embed-number").value;
      if (embednumber == "1")
        firstRankMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
      if (embednumber == "2")
        buttonFinalMessages(channel).catch((err) => {
          console.log(err.rawError.message);
          error = true;
        });
    }

    if (error == true) {
      return interaction.reply({
        content: "Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }

    interaction.reply({
      content: "Mensagem gerada com sucesso!",
      ephemeral: true,
    });
  },
};
