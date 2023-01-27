const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getter } = require("../utils/firebase/firebaseGuildApi.js");
const { checkSheetTitle } = require("../utils/googleApi/forumApi.js");
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
    ).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  dev: false,

  async execute(interaction) {
    const { guildId, guild, options } = interaction;
    const args = options.get("type").value;
    console.log(args);
    if (args == "tag") {
      const genericId = await getter(guildId, "channel", 'forum');
      if (genericId == undefined) return
      const forumChannel = guild.channels.cache.find((chn) => chn.id === genericId);
      if (forumChannel == undefined) return
      let resultArray = ""
      let index = 0
      for (const rows of forumChannel.availableTags) {
        if (index == 0) resultArray += `${rows.name} (${rows.id}) `
        else resultArray += `| ${rows.name} (${rows.id}) `
        index++
      }
      return await interaction.reply({content:"Tags: " + resultArray,ephemeral: true});
    } else if (args == "sheets") {
      console.log(checkSheetTitle());
      return await interaction.reply({content:"Veja a logs do bot!",ephemeral: true});
    } else {
      return await interaction.reply({content:"Opa! Esse tipo não existe.",ephemeral: true});
    }
  },
};
