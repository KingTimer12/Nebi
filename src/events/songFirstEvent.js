const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "First Song",
  event: "songFirst",
  once: false,
  player: true,

  createEvent(queue, song) {
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

    return interaction.editReply({
      embeds: [embed],
      ephemeral: false
    }).catch(console.error);
  },
};
