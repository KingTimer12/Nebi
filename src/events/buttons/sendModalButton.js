const { TextInputComponent, showModal, Modal } = require("discord-modals");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { array, removeElement, add } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");

module.exports = {
  customId: "send-info",
  async execute(interaction, client) {
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
          .setPlaceholder(
            "Exemplos de tipo: original, fanart, releitura, cópia, etc..."
          )
          .setRequired(true),
        new TextInputComponent()
          .setCustomId("comments")
          .setStyle("LONG")
          .setLabel("Comentário:")
          .setMaxLength(1000)
          .setRequired(false)
      );
    return await showModal(modal, {interaction: interaction, client:client}).catch(console.log);
  },
};
