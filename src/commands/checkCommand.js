const { SlashCommandBuilder } = require("discord.js");
const { checkSheetTitle } = require("../utils/googleApi.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("information")
    .setDescription(
      "Pegar informações cruciais do sheets e id das tags do fórum."
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Selecionar o tipo da informação")
        .setRequired(true)
        .addChoices(
          { name: "Sheets", value: "sheets" },
          { name: "Tags", value: "tag" }
        )
    ),

  dev: true,

  async execute(interaction) {
    const { channel, client, member, options } = interaction;
    const args = options.get("type").value;
    console.log(args);
    if (args == "tag") {
      const forumChannel = client.channels.cache.find(
        (channel) => channel.id === process.env.FORUM_ID
      );
      console.log(forumChannel.availableTags);
      return await interaction.reply("Veja a logs no debug!");
    } else if (args == "sheets") {
      console.log(checkSheetTitle());
      return await interaction.reply("Veja a logs no debug!");
    } else {
      return await interaction.reply("Opa! Esse tipo não existe.");
    }
  },
};
