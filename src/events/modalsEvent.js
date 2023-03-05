module.exports = {
  name: "Modals",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction, client) {
    if (!interaction.isModalSubmit()) return
    const { customId } = interaction;
    let modal = client.modals.get(customId);
    if (!modal) return

    try {
      await modal.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return await interaction.reply({
        content: "Ocorreu um erro ao executar esse modal!",
        ephemeral: true,
      });
    }
  },
};
