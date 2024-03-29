module.exports = {
  name: "Buttons",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction, client) {
    if (!interaction.isButton()) return;
    const { customId } = interaction;
    var button = client.buttons.get(customId);
    if (!button) return

    console.log(`{BUTTON} | ${interaction.user.tag} (${interaction.user.id}) clicou no botão ${customId} no canal ${interaction.channel.name}`)

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
