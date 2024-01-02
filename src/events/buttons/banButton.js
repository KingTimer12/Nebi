const { banUser, deleteAllSenderMessages } = require("../../database/manager/mailManager");

module.exports = {
  customId: "ban-btn",
  async execute(interaction, client) {
    const { user, message } = interaction;
    const userId = user.id;
    const content = message.content
    const userIdRegex = /UserID: \*\*(\d+)\*\*/;
    const match = content.match(userIdRegex);
    if (match) {
      const targetId = match[1];
      await banUser(targetId)
      await deleteAllSenderMessages(targetId)
      return await interaction.reply({ content: 'Usuário banido do evento!', ephemeral: true, fetchReply: true }).catch(console.error)
    } else {
      return await interaction.reply({ content: 'UserID do remetente não encontrado!', ephemeral: true, fetchReply: true }).catch(console.error)
    }
  },
};
