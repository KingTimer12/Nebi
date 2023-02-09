const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Play Song",
  event: "playSong",
  once: false,
  distube: true,

  createEvent(queue, song) {
    const interaction = song.metadata;
    const user = song.user;
    const { name } = song.uploader;

    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("Tocando agora")
      .setImage(song.thumbnail)
      .setDescription(
        `**[${song.name}](${song.url})**\nDuração: **[${queue.formattedCurrentTime} - ${song.formattedDuration}]**\nCanal: **${name}**`
      )
      .setTimestamp()
      .setFooter({
        text: `Colocado pelo: ${user.username}`,
        iconURL: user.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 512,
        }),
      });

    if (interaction != undefined)
      return interaction.editReply({
        embeds: [embed],
      }).catch(console.error);
    queue.textChannel.send({ embeds: [embed] }).catch(console.error);
  },
};