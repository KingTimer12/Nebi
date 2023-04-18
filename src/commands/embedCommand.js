const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription(
      "Crie um embed no nome da Nebi!"
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("O canal que vai enviar o embed. O bot precisa ter permissão lá.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("embeds")
        .setDescription("O json do embed. (Pode conter mensagem)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("components")
        .setDescription("O json para botões, seletores, etc.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("Coloque o link da imagem.")
        .setRequired(false)
    ).setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

  dev: false,

  async execute(interaction) {
    const { options, guild } = interaction;
    const channelId = options.get("channel").value;
    const jsonEmbedString = options.get("embeds").value;
    const imageGet = options.get("image")

    let imageUrl = ''
    let jsonComponent = undefined
    if (options.get("components")) jsonComponent = JSON.parse(options.get("components").value)
    if (imageGet) imageUrl = imageGet.value

    const json = JSON.parse(jsonEmbedString)

    const channel = guild.channels.cache.find((chn) => chn.id === channelId);
    if (channel == undefined) return interaction.reply({
        content: "Esse canal de TEXTO não existe no servidor.",
        ephemeral: true,
      });
      
      if (!imageGet && !jsonComponent) {
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
      } else if (imageGet) {
        channel.send({embeds:json, files: [{ attachment: imageUrl, name: `nebiImagem.png` }]}).then(c => {
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
      } else if (jsonComponent) {
        channel.send({embeds:json, components:jsonComponent}).then(c => {
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
      } else {
        channel.send({embeds:json, components:jsonComponent, files: [{ attachment: imageUrl, name: `nebiImagem.png` }]}).then(c => {
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
      }
    
  },
};