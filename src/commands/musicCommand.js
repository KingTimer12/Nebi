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
      subcommand
        .setName("pausar")
        .setDescription("Pausa a música que está tocando.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("continuar")
        .setDescription("Continua a música que estava tocando.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sair")
        .setDescription("O bot sairá do canal.")
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
    const { options, member, channel, client } = interaction;

    const subcommand = interaction.options.data[0];

    const queue = client.distube.getQueue(interaction);

    const embed = new EmbedBuilder();

    switch (subcommand.name) {
      case "tocar":
        let int = interaction;
        const musicString = options.get("song").value;
        if (musicString == undefined)
          return interaction.reply({
            content: `${emojis["error"]} Faltou enviar o link ou nome da música que deseja tocar.`,
            ephemeral: true,
          });

        interaction.deferReply().then(async () => {
          await client.distube.play(member.voice.channel, musicString, {
            member: member,
            textChannel: channel,
            metadata: int,
          });
        });
        break;
      case "pular":
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
      case "parar":
        if (!queue)
          return interaction
            .reply({
              content: `${emojis["error"]} Não tem nenhuma música tocando.`,
              ephemeral: true,
            })
            .catch(console.log);
        await queue.stop();

        interaction
          .reply(
            `${emojis["ready"]} Todas as músicas da lista foram canceladas.`
          )
          .catch(console.log);
        break;
      case "sair":
        client.distube.voices.leave(interaction)

        interaction
          .reply(
            `${emojis["ready"]} O bot saiu da call.`
          )
          .catch(console.log);
        break;
      case "pausar":
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
      case "continuar":
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
      case "loop":
        if (!queue)
          return interaction
            .reply({
              content: `${emojis["error"]} Não tem nenhuma música tocando.`,
              ephemeral: true,
            })
            .catch(console.log);

        const modeString = options.get("mode").value;
        if (modeString == undefined)
          return interaction
            .reply({
              content: `${emojis["error"]} Faltou dizer o que deseja repetir ou desabilitar.`,
              ephemeral: true,
            })
            .catch(console.log);
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

        interaction
          .reply({
            content: `${emojis["ready"]} ${mode}`,
          })
          .catch(console.log);

        break;
      default:
        break;
    }

    /*
    switch (action) {
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
