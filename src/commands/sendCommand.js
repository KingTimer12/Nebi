const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config();
const {
  Modal,
  TextInputComponent,
  showModal
} = require("discord-modals");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enviar")
    .setDescription("Use: /enviar <evento>")
    .addStringOption((option) =>
      option
        .setName("evento")
        .setDescription("Para qual tipo de evento você deseja participar?")
        .setRequired(true)
        .addChoices({ name: "Leitura Interativa", value: "LI" })
        .addChoices({ name: "Mural dos Desenhos da Semana", value: "MD" })
    ),

  dev: false,

  async execute(interaction) {
    const { options, client } = interaction;
    const event = options.get("evento").value;

    if (event == "LI") {
      const modal = new Modal()
        .setCustomId("modal-li")
        .setTitle("Leitura Interativa")
        .addComponents(
          new TextInputComponent()
            .setCustomId("text-name")
            .setStyle("SHORT")
            .setLabel("O nome do texto:")
            .setPlaceholder("Exemplo: Partícula das Almas - Cap 1")
            .setRequired(true),
          new TextInputComponent()
            .setCustomId("link")
            .setStyle("SHORT")
            .setLabel("Link da obra:")
            .setPlaceholder("Recomendado utilizar o Google Docs.")
            .setRequired(true)
        );
      return showModal(modal, { client: client, interaction: interaction });
    }
    if (event == "MD") {
      const modal = new Modal()
        .setCustomId("modal-md")
        .setTitle("Mural dos Desenhos da Semana")
        .addComponents(
          new TextInputComponent()
            .setCustomId("draw-name")
            .setStyle("SHORT")
            .setLabel("Título/nome do desenho:")
            .setPlaceholder("")
            .setRequired(true),
          new TextInputComponent()
            .setCustomId("type")
            .setStyle("SHORT")
            .setLabel("Tipo:")
            .setPlaceholder("Exemplos de tipo: original, fanart, releitura, cópia, etc...")
            .setRequired(true),
          new TextInputComponent()
            .setCustomId("comments")
            .setStyle("LONG")
            .setLabel("Comentário:")
            .setPlaceholder("O máximo de caracteres é 1000! Mais do que isso não será enviado.")
            .setRequired(false)
        );
      return showModal(modal, { client: client, interaction: interaction });
    }
  },
};
