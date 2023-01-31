const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { setter } = require("../utils/firebase/firebaseGuildApi");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription(
      "Armazenar informações cruciais para o funcionamento do bot."
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Estamos mexendo com o quê?")
        .setRequired(true)
        .addChoices(
          { name: "Canal", value: "channel" },
          { name: "Cargo", value: "role" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("id-name")
        .setDescription("Selecione um nome de busca.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription(
          "O id em snowflake do tag/canal/cargo para armazenar no banco de dados."
        )
        .setRequired(true)
    ).setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

  dev: false,

  async execute(interaction) {
    const { options, guildId } = interaction;
    const type = options.get("type").value;
    const name = options.get("id-name").value;
    const genericId = options.get("id").value;
    await setter(guildId, type, name, genericId);
    let markResult = `<#${genericId}> foi`;
    if (type == "role") {
      markResult = `<@&${genericId}> foi`;
    }
    interaction.reply({
      content: `O ${markResult} adicionado no banco de dados!`,
      ephemeral: true,
    });
  },
};
