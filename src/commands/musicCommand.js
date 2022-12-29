const { RepeatMode } = require("discord-music-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { emojis } = require("../utils/emotes.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("musica")
    .setDescription("Use: /musica <ação> [link/nome da música]")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tocar")
        .setDescription("Tocar a música")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription(
              "Diga se o link é uma playlist ou somente um vídeo."
            )
            .setRequired(true)
            .addChoices({ name: "Video", value: "video" })
            .addChoices({ name: "Playlist", value: "playlist" })
        )
        .addStringOption((option) =>
          option
            .setName("song")
            .setDescription("O link ou nome da música que deseja tocar.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("pular").setDescription("Pular para próxima música.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("parar").setDescription("Parar a lista de músicas.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("pausar").setDescription("Pausa a música que está tocando.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("continuar").setDescription("Continua a música que estava tocando.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("loop")
        .setDescription("Loopar a lista inteira ou só a música?")
        .addStringOption((option) =>
          option
            .setName("mode")
            .setDescription("Selecione entre: desabilitar, lista e música.")
            .setRequired(true)
            .addChoices({ name: "Desabilitar", value: "disable" })
            .addChoices({ name: "Lista", value: "queue" })
            .addChoices({ name: "Música", value: "song" })
        )
    ),
  dev: false,

  async execute(interaction) {
    const { guildId, options, member, channel, client } = interaction;

    const subcommand = interaction.options.data[0];

    let guildQueue = client.player.getQueue(guildId);

    const embed = new EmbedBuilder();

    switch (subcommand.name) {
      case "tocar":
        let int = interaction;
        const type = options.get("type").value;

        const music = options.get("song");
        const musicString = music.value;
        if (musicString == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou enviar o link ou nome da música que deseja tocar.`,
            ephemeral: true,
          });

        interaction
          .deferReply()
          .then(async () => {
            let queue = client.player.createQueue(guildId);
            await queue.join(member.voice.channel);

            if (type == "video") {
              await queue
                .play(musicString, { requestedBy: member.user })
                .then((song) => {
                  song.setData({ interaction: int });
                  const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Adicionado a lista")
                    .setDescription(`Vídeo: **${song.name}**`);

                  int.editReply({
                    embeds: [embed],
                    ephemeral: false,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  if (!guildQueue) queue.stop();
                });
            } else {
              await queue.playlist(musicString, { requestedBy: member.user })
                .then((playlist) => {
                  playlist.songs.forEach(song => song.setData({ interaction: int }));
                  const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Adicionado a lista")
                    .setDescription(`Playlist: **${playlist.name}**`);

                  int.editReply({
                    embeds: [embed],
                    ephemeral: false,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  if (!guildQueue) queue.stop();
                });
            }
          })
          .catch(console.error);
        break;
      case "pular":
        if (!guildQueue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        await guildQueue.skip();

        embed.setColor("Green").setTitle("A música foi pulada!");

        interaction.reply({
          embeds: [embed],
        }).catch(console.error);
        break;
      case "parar":
        if (!guildQueue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        await guildQueue.stop();

        embed.setColor("Green").setTitle("Todas as músicas foram canceladas!");

        interaction.reply({
          embeds: [embed],
        }).catch(console.error);
        break;
      case "pausar":
        if (!guildQueue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        await guildQueue.setPaused(true);

        embed.setColor("Grey").setTitle("Música pausada!");

        interaction.reply({
          embeds: [embed],
        }).catch(console.error);
        break;
      case "continuar":
        if (!guildQueue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        await guildQueue.setPaused(false);

        embed.setColor("Green").setTitle("A música retornou!");

        interaction.reply({
          embeds: [embed],
        }).catch(console.error);
        break;
      case "loop":
        if (!guildQueue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        const modeSelect = options.get("mode");
        const modeString = modeSelect.value;
        if (modeString == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou dizer o que deseja repetir ou desabilitar.`,
            ephemeral: true,
          });

        let mode = 0;

        if (modeString == "queue") {
          guildQueue.setRepeatMode(RepeatMode.QUEUE);
          mode = 2;
        } else if (modeString == "disable") {
          guildQueue.setRepeatMode(RepeatMode.DISABLED);
          mode = 0;
        } else if (modeString == "song") {
          guildQueue.setRepeatMode(RepeatMode.SONG);
          mode = 1;
        }

        mode = mode
          ? mode === 2
            ? "Repetir habilidado e repetindo a lista."
            : "Repetir habilidado e repetindo a música."
          : "Repetir desabilitado.";

        interaction.reply({
          content: `${emojis["ready"]} ${mode}`,
        }).catch(console.error);
        break;
      default:
        break;
    }

    /*const queue = client.distube.getQueue(interaction);

    const embed = new EmbedBuilder();

    switch (action) {
      case "stop":
        if (!queue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });
        queue.stop();

        interaction.reply(
          `${emojis["ready"]} Todas as músicas da lista foram canceladas.`
        );
        break;
      case "leave":
        client.distube.voices.leave(interaction);
        interaction.reply({
          content: `${emojis["ready"]} O bot saiu da sala.`,
        });
        break;
      case "loop":
        if (!queue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        const modeSelect = options.get("mode");
        if (modeSelect == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou dizer o que deseja repetir ou desabilitar.`,
            ephemeral: true,
          });
        const modeString = modeSelect.value;
        if (modeString == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou dizer o que deseja repetir ou desabilitar.`,
            ephemeral: true,
          });
        let mode = 0;
        if (modeString == "queue") {
          mode = 2;
        } else if (modeString == "song") {
          mode = 1;
        }

        mode = queue.setRepeatMode(mode);
        mode = mode
          ? mode === 2
            ? "Repetir habilidado e repetindo a lista."
            : "Repetir habilidado e repetindo a música."
          : "Repetir desabilitado.";

        interaction.reply({
          content: `${emojis["ready"]} ${mode}`,
        });

        break;
      case "skip":
        if (!queue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });
        const song = await queue.skip();

        embed
          .setColor("Green")
          .setTitle("Pulada!")
          .setDescription(`Próxima música: ${song.name}`);

        interaction.reply({
          embeds: [embed],
        });
        break;
      case "pause":
        if (!queue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        if (queue.paused) {
          return interaction.reply({
            content: `${emojis["error"]} A música já está pausada!`,
            ephemeral: true,
          });
        }

        const queuePause = queue.pause();
        const songPause = queuePause.songs.at(0);
        const userPause = songPause.user;

        embed
          .setColor("DarkRed")
          .setTitle("⏸ Pausado")
          .setImage(songPause.thumbnail)
          .setDescription(
            `**[${songPause.name}](${songPause.url})**\nDuração: **[${queuePause.formattedCurrentTime} - ${songPause.formattedDuration}]**\nCanal: **${songPause.uploader.name}**`
          )
          .setTimestamp()
          .setFooter({
            text: `Colocado pelo: ${userPause.username}`,
            iconURL: userPause.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 512,
            }),
          });

        interaction.reply({
          embeds: [embed],
        });
        break;
      case "resume":
        if (!queue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        if (!queue.paused) {
          return interaction.reply({
            content: `${emojis["error"]} A música já está tocando!`,
            ephemeral: true,
          });
        }

        const resumeQueue = queue.resume();
        const songResume = resumeQueue.songs.at(0);
        const userResume = songResume.user;

        embed
          .setColor("DarkRed")
          .setTitle("⏵ Continuando")
          .setImage(songResume.thumbnail)
          .setDescription(
            `**[${songResume.name}](${songResume.url})**\nDuração: **[${resumeQueue.formattedCurrentTime} - ${songResume.formattedDuration}]**\nCanal: **${songResume.uploader.name}**`
          )
          .setTimestamp()
          .setFooter({
            text: `Colocado pelo: ${userResume.username}`,
            iconURL: userResume.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 512,
            }),
          });

        interaction.reply({
          embeds: [embed],
        });
        break;
      case "queue":
        if (!queue)
          return interaction.reply({
            content: `${emojis["error"]} Não tem nenhuma música tocando.`,
            ephemeral: true,
          });

        const q = queue.songs
          .map(
            (song, i) =>
              `${i === 0 ? "**Tocando:**" : i > 10 ? "" : `**${i}.**`}${
                i > 10 ? "" : ` ${song.name}  - \`${song.formattedDuration}\``
              }`
          )
          .join("\n");

        interaction.reply({
          content: `${q}`,
        });
        break;
      default:
        break;
    }*/
  },
};
