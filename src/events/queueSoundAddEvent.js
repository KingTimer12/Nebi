const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Queue Song",
  event: "addSong",
  once: false,
  distube: true,

  createEvent(queue, song) {
    const interaction = song.metadata;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Adicionado a lista")
      .setDescription(`**${song.name}**`);

    if (interaction != undefined)
      return interaction.editReply({
        embeds: [embed],
      }).catch(console.error);
    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  },
};
