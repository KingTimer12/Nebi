const { Modal, TextInputComponent, showModal } = require("discord-modals");


module.exports = {
  customId: "edit-all",
  async execute(interaction, client) {
    const modal = new Modal()
      .setCustomId("modal-md-edit")
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
          .setPlaceholder(
            "Exemplos de tipo: original, fanart, releitura, cópia, etc..."
          )
          .setRequired(true),
        new TextInputComponent()
          .setCustomId("comments")
          .setStyle("LONG")
          .setLabel("Comentário:")
          .setPlaceholder(
            "O máximo de caracteres é 1000! Mais do que isso não será enviado."
          )
          .setRequired(false)
      );
    return showModal(modal, { client: client, interaction: interaction });
  },
};
