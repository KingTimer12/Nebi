const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { array, removeElement } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");
const { getTutores } = require("../../utils/googleApi/rankApi");

module.exports = {
  customId: "formAccept",
  async execute(interaction, client) {
    const { user, channel, guild } = interaction;
    const int = interaction;

    const targetMember = guild.members.cache.find(
      (member) => member.user.tag.replace("#", "") == channel.name
    );

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
