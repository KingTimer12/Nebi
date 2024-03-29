module.exports = {
  name: "Select Menu",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction, client) {
    if (!interaction.isStringSelectMenu()) return;
    const { customId } = interaction;

    var select = client.selects.get(customId);
    if (!select) return;

    console.log(`{SELECT} | ${interaction.user.tag} (${interaction.user.id}) usou o select ${customId} no canal ${interaction.channel.name}`)

    try {
      await select.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return await interaction.reply({
        content: "Ocorreu um erro ao executar esse selecionar!",
        ephemeral: true,
      }).catch(console.error);
    }
  },
};
