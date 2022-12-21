const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Queue Song",
  event: "addSong",
  once: false,
  distube: true,

  createEvent(queue, song) {

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Adicionado a lista")
      .setDescription(`**${song.name}**`)

    queue.textChannel.send({ embeds: [embed] });
  },
};
