const { getter } = require("../utils/firebaseGuildApi");

module.exports = {
  name: 'Buttons',
  event: 'interactionCreate',
  once: false,
  
  async createEvent(interaction) {
    if (!interaction.isButton()) return;
    const { member, customId, guildId } = interaction;

    if (customId == "next") {
      const rolesChannelId = await getter(guildId, 'channel', 'roles')
      const rolesRoleId = await getter(guildId, 'role', 'roles')
      const registerRoleId = await getter(guildId, 'role', 'register')

      const registerRole = member.roles.cache.find(
        (role) => role.id === registerRoleId
      );

      if (registerRole == undefined)
        return interaction.reply({
          content: `Você já está liberado para explorar o servidor!`,
          ephemeral: true,
        });
      const role = member.guild.roles.cache.find(
        (role) => role.id === rolesRoleId
      );
      const rolesRole = member.roles.cache.find(
        (r) => r === role
      );
      if (rolesRole !== undefined) {
        return interaction.reply({
          content: `Você já tem acesso ao segundo passo! Vá para o chat <#${rolesChannelId}>.`,
          ephemeral: true,
        });
      }
      member.roles.add(role);
      interaction.reply({
        content: `Siga para o próximo passo no chat <#${rolesChannelId}>!`,
        ephemeral: true,
      });
    }
  },
};
