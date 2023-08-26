const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();
const { emojis } = require("../utils/emotes.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mural")
    .setDescription("Comando do mural de eventos")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enviar")
        .setDescription("Envie seu desenho para o mural.")
    ),

  dev: false,

  async execute(interaction) {
    const { options, user } = interaction;
    const subcommand = options.data[0];
    const userId = user.id;

    switch (subcommand.name) {
      case "enviar":
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("send-img")
            .setEmoji({ id: "1051884167782219776", name: "error" })
            .setLabel("Enviar imagem")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("send-info")
            .setEmoji({ id: "1051884167782219776", name: "error" })
            .setLabel("Enviar informações")
            .setStyle(ButtonStyle.Danger)
        );

        createUserDraw(userId, interaction)

        await interaction.reply({
          content:
            `Descrição de cada botão:
                  **Botão de imagem**: __envia__ o desenho que deseja colocar no mural.
                  **Botão de informações**: __envia__ as informações sobre seu desenho. (Aparecerá um formulário no próprio Discord que deverá ser preenchido)\n\n` +
            `Quando ambos botões estiverem verdes(${emojis["ready"]}), será iniciado a etapa de confirmação.\n` +
            `Esse comando foi criado pelo <@462040475684175904>! Peça ajuda a ele caso tenha alguma dúvida.`,
          fetchReply: true,
          components: [row],
          ephemeral: true,
        }).catch(console.error);
        break;
    }
  },
};
