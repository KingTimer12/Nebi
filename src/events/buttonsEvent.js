module.exports = {
  name: "Buttons",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction, client) {
    if (!interaction.isButton()) return;
    const { customId } = interaction;
    let button = client.buttons.get(customId);
    if (!button) return

    try {
      await button.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "Ocorreu um erro ao executar esse botão!",
        ephemeral: true,
      });
    }
    
  },
};
