const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { emojis } = require("../utils/emotes.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("música")
    .setDescription("Use: /musica <ação> [link/nome da música]")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Qual ação deseja praticar?")
        .setRequired(true)
        .addChoices({ name: "Tocar", value: "play" })
        .addChoices({ name: "Pular", value: "skip" })
        .addChoices({ name: "Parar", value: "stop" })
        .addChoices({ name: "Pausar", value: "pause" })
        .addChoices({ name: "Continuar", value: "resume" })
        .addChoices({ name: "Listar", value: "queue" })
        .addChoices({ name: "Repetir", value: "loop" })
        .addChoices({ name: "Sair", value: "leave" })
    )
    .addStringOption((option) =>
      option
        .setName("music")
        .setDescription("O link ou nome da música que deseja tocar.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Selecione entre: desabilitar, lista e música.")
        .setRequired(false)
        .addChoices({ name: "Desabilitar", value: "disable" })
        .addChoices({ name: "Lista", value: "queue" })
        .addChoices({ name: "Música", value: "song" })
    ),

  dev: false,

  async execute(interaction) {
    const { options, member, channel, client } = interaction;
    const action = options.get("action").value;

    const queue = client.distube.getQueue(interaction);

    const embed = new EmbedBuilder();

    switch (action) {
      case "play":
        let int = interaction;
        const music = options.get("music");
        if (music == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou enviar o link ou nome da música que deseja tocar.`,
            ephemeral: true,
          });
        const musicString = music.value;
        if (musicString == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou enviar o link ou nome da música que deseja tocar.`,
            ephemeral: true,
          });

        interaction
          .deferReply()
          .then(() => {
            client.distube.play(member.voice.channel, musicString, {
              member: member,
              textChannel: channel,
              metadata: int,
            });
          })
          .catch(console.error);
        break;
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
    }
  },
};
