const { getter } = require("../../utils/firebase/firebaseGuildApi");


module.exports = {
  customId: "next",
  async execute(interaction, client) {
    const { member, guildId } = interaction;

    const rolesChannelId = await getter(guildId, "channel", "roles");
    const rolesRoleId = await getter(guildId, "role", "roles");
    const registerRoleId = await getter(guildId, "role", "register");

    if (rolesChannelId == undefined) {
      return interaction.reply({
        content:
          "O canal `cargos` não está setado! Comunique para algum administrador sobre o ocorrido.",
        ephemeral: true,
      });
    }

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
    const rolesRole = member.roles.cache.find((r) => r === role);
    if (rolesRole !== undefined) {
      return interaction.reply({
        content: `Você já tem acesso ao segundo passo! Vá para o chat <#${rolesChannelId}>.`,
        ephemeral: true,
      });
    }
    member.roles.add(role).catch(console.log);
    return interaction.reply({
      content: `Siga para o próximo passo no chat <#${rolesChannelId}>!`,
      ephemeral: true,
    }).catch(console.log);
  },
};
