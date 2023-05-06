module.exports = {
  name: "Select Menu",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction, client) {
    if (!interaction.isStringSelectMenu()) return;
    const { customId } = interaction;

    var select = client.selects.get(customId);
    if (!select) return;

    try {
      await select.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return await interaction.reply({
        content: "Ocorreu um erro ao executar esse selecionar!",
        ephemeral: true,
      }).catch(() => {});
    }
  },
};
