const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();
const { emojis } = require("../utils/emotes.json");
const { toMoment, sundayTimestamp } = require("../utils/timerApi");
const { fetchUserDraw, createAndSaveUserDraw } = require("../database/manager/drawManager");

async function sendMessage(interaction, message, image) {
  const msg = await interaction.user.send({ content: `**${message}**` });
  const check = image ? await awaitImage(msg.channel) : await awaitMessage(msg.channel);
  return check;
}

async function awaitMessage(channel) {
  const filter = (msg) => msg.content != "";
  const sendedMessage = channel
    .awaitMessages({ max: 1, time: 120_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { content: undefined, message: msgFirst };

      const m = msgFirst.content;
      if (m != undefined) response.content = m;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

async function awaitImage(channel) {
  const filter = (msg) => msg.attachments.size > 0;
  const sendedMessage = channel
    .awaitMessages({ max: 1, time: 120_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { url: undefined, message: msgFirst };

      const img = msgFirst.attachments.at(0);
      if (img != undefined) response.url = img.url;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mural")
    .setDescription("Comando do mural de eventos")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enviar")
        .setDescription("Envie seu desenho para o mural.")
    ),

  dev: false,

  async execute(interaction) {
    const { options, user } = interaction;
    const subcommand = options.data[0];
    const userId = user.id;

    switch (subcommand.name) {
      case "enviar":
        await interaction.reply({
          content:
            `Uma mensagem foi enviada para sua DM.`,
          ephemeral: true,
        }).catch(console.error);

        let response = await sendMessage(interaction, 'Título: (Digita somente o título do desenho abaixo)', false)
        if (response == undefined) return interaction.user.send(
          "Você demorou muito para responder!"
        );
        const title = response.content;

        response = await sendMessage(interaction, 'Tipo: (Digita somente o tipo do desenho abaixo)\n**Por exemplo: Orginal, Fanart, etc**', false)
        if (response == undefined) return interaction.user.send(
          "Você demorou muito para responder!"
        );
        const draw_type = response.content;

        response = await sendMessage(interaction, 'Comentário: (Digita somente o comentário do desenho abaixo)\n**Escreva: `-` ou `não tem` caso não tenha nenhum comentário a dar.**', false)
        if (response == undefined) return interaction.user.send(
          "Você demorou muito para responder!"
        );
        const comment = response.content;

        response = await sendMessage(interaction, 'Imagem: (Envie a imagem)', true)
        if (response == undefined) return interaction.user.send(
          "Você demorou muito para responder!"
        );
        const image = response.url;

        const dateInt = sundayTimestamp();
        const dateString =
          toMoment(Date.now()).weekday() == 0
            ? ", hoje"
            : ` <t:${parseInt(dateInt)}:R>`;

        let drawsCurrent = [];
        const userDraw = await fetchUserDraw(userId);
        if (userDraw && userDraw.draws) drawsCurrent = userDraw.draws;

        const drawResult = {
          name: title,
          type: draw_type,
          link: image,
          description: comment,
        };

        drawsCurrent.push(drawResult);

        try {
          result = await createAndSaveUserDraw(user, drawsCurrent);
        } catch (error) {
          console.error(error);
        }

        if (!result) {
          return await interaction.user.send('Ocorreu um erro no banco dados');
        }

        await interaction.user.send(`${emojis["ready"]} A imagem será enviada no mural${dateString}!`)
        break;
    }
  },
};
