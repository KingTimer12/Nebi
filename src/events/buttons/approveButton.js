const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { getRole } = require("../../database/manager/guildManager");
const { array, removeElement } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");
const { getTutores } = require("../../utils/googleApi/rankApi");

module.exports = {
  customId: "formAccept",
  async execute(interaction, client) {
    const { channel, guild } = interaction;

    const targetMember = guild.members.cache.find(
      (member) => member.user.username == channel.name
    );

    const studentId = await getRole(guild, { roleName: "student" });
    if (studentId == undefined) return;
    let studentRole = guild.roles.cache.find((role) => role.id == studentId);
    if (!targetMember) {
      return await interaction
        .reply({
          content: `${emojis["error"]} Aconteceu um erro. Id do erro: #Abhj29ff.`,
          ephemeral: true,
        })
        .catch(console.error);
    }
    const hasStudent = targetMember.roles.cache.find(
      (role) => role == studentRole
    );

    if (hasStudent) {
      return await interaction
        .reply({
          content: `${emojis["error"]} <@${targetMember.id}> já faz parte da tutoria.`,
          ephemeral: true,
        })
        .catch(() => {});
    }

    const array = [];
    const tutores = await getTutores(429915779);
    for (const row of tutores) {
      array.push({
        label: row.tutor,
        value: row.tutorId,
      });
    }

    const row2 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-tutor")
        .setPlaceholder("Selecione o tutor!")
        .addOptions(array)
    );

    return await interaction
      .reply({
        content: `Qual será o tutor de <@${targetMember.id}>? ${emojis["entendo"]}`,
        components: [row2],
        files: [],
        ephemeral: true,
      })
      .catch(console.log);
  },
};
