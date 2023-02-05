const { InteractionType } = require("discord.js");
const { emojis } = require('../utils/emotes.json')

module.exports = {
  name: 'Slash Create',
  event: 'interactionCreate',
  once: false,
  
  async createEvent(interaction, client) {
    const { user, type, commandName } = interaction;
    if (user.bot) return;

    if (type == InteractionType.ApplicationCommand) {
      const command = client.commands.get(commandName)
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        return await interaction.reply({
          content: `${emojis["error"]} Ocorreu um erro ao executar esse comando!`,
          ephemeral: true,
        }).catch(console.log);
      }
    }
  },
};
