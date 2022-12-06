const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription(
      "Crie um embed no nome da Nebi!"
    )
    .addStringOption((option) =>
      option
        .setName("channel")
        .setDescription("O id do canal que queria enviar o embed. O bot precisa estar lá.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("json")
        .setDescription("O json do embed. (Pode conter mensagem) (Não recomendo colocar botão)")
        .setRequired(true)
    ).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  dev: true,

  async execute(interaction) {
    const { options, guild } = interaction;
    const channelId = options.get("channel").value;
    const jsonString = options.get("json").value;
    const json = JSON.parse(jsonString)

    const channel = guild.channels.cache.find((chn) => chn.id === channelId);
    if (channel == undefined) return interaction.reply({
        content: "Esse canal de TEXTO não existe no servidor.",
        ephemeral: true,
      });
      
      channel.send({embeds:json}).then(c => {
        interaction.reply({
            content: "Embed gerado com sucesso!.",
            ephemeral: true,
          });    
      }).catch(err => {
        interaction.reply({
            content: "Ocorreu um erro!",
            ephemeral: true,
          });
          console.log(err)
      })
    
  },
};