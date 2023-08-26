const { ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  customId: "edit-all",
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("modal-md-edit")
      .setTitle("Mural dos Desenhos da Semana")
      .addComponents(
        new TextInputBuilder()
          .setCustomId("draw-name")
          .setStyle("SHORT")
          .setLabel("Título/nome do desenho:")
          .setPlaceholder("")
          .setRequired(true),
        new TextInputBuilder()
          .setCustomId("type")
          .setStyle("SHORT")
          .setLabel("Tipo:")
          .setPlaceholder(
            "Exemplos de tipo: original, fanart, releitura, cópia, etc..."
          )
          .setRequired(true),
        new TextInputBuilder()
          .setCustomId("comments")
          .setStyle(TextInputStyle.Paragraph)
          .setLabel("Comentário:")
          .setMaxLength(1000)
          .setRequired(false)
      );
    return await interaction.showModal(modal).catch(console.log);
  },
};