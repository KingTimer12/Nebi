const { muteUser, deleteMessage } = require("../../database/manager/mailManager");

module.exports = {
  customId: "mute-btn",
  async execute(interaction, client) {
    const { user, message } = interaction;
    const content = message.content
    const userIdRegex = /UserID: \*\*(\d+)\*\*/;
    const matchUser = content.match(userIdRegex);

    const targetIdRegex = /TargetID: \*\*(\d+)\*\*/;
    const matchTargetUser = content.match(targetIdRegex);
    if (matchUser && matchTargetUser) {
      const userId = matchUser[1];
      const targetId = matchTargetUser[1]
      await muteUser(userId)
      await deleteMessage(userId, targetId)
      return await interaction.reply({ content: 'Usuário mutado do evento!', ephemeral: true, fetchReply: true }).catch(console.error)
    } else {
      return await interaction.reply({ content: 'UserID do remetente não encontrado!', ephemeral: true, fetchReply: true }).catch(console.error)
    }
  },
};
