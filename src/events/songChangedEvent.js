const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Changed Song",
  event: "songChanged",
  once: false,
  player: true,

  createEvent(queue, newSong, oldSong) {
    const song = newSong;
    const interaction = song.data.interaction;
    const user = song.requestedBy;

    const author = song.author;
    const duration = song.duration;

    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("Tocando agora")
      .setImage(song.thumbnail)
      .setDescription(
        `**[${song.name}](${song.url})**\nDuração: **${duration}**\nCanal: **${author}**`
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

    return interaction.channel.send({
      embeds: [embed],
    }).catch(console.error);
  },
};
