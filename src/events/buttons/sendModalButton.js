const {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  customId: "send-info",
  async execute(interaction) {
    //Exemplos de tipo: original, fanart, releitura, cópia, etc...
    const modal = new ModalBuilder()
      .setCustomId("modal-md")
      .setTitle("Mural de Desenhos");
    const drawName = new TextInputBuilder()
      .setCustomId("drawName")
      .setLabel("Qual nome/título do desenho?")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short);

    const type = new TextInputBuilder()
      .setCustomId("drawType")
      .setLabel("Qual tipo?")
      .setMaxLength(100)
      .setPlaceholder(
        "Exemplos de tipo: original, fanart, releitura, cópia, etc..."
      )
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("drawDescription")
      .setLabel("Qual comentário?")
      .setValue("Sem comentários")
      .setRequired(false)
      .setMaxLength(1000)
      .setStyle(TextInputStyle.Paragraph);

    const drawNameActionRow = new ActionRowBuilder().addComponents(
      drawName
    );

    const drawTypeActionRow = new ActionRowBuilder().addComponents(
      type
    );

    const drawDescriptionActionRow = new ActionRowBuilder().addComponents(
      description
    );

    modal.addComponents(drawNameActionRow, drawTypeActionRow, drawDescriptionActionRow);

    await interaction.showModal(modal).catch(console.error);
  },
};
