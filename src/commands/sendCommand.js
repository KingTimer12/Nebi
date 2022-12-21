const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const { add } = require("../managers/drawManager");
const { getWeek, getData } = require("../utils/firebase/firabaseDraw");
const { getNextSunday } = require("../utils/timerApi");
const { createEvent } = require("../events/modalsEvent");

async function awaitImage(interaction) {
  const filter = (msg) =>
    interaction.user.id == msg.author.id && msg.attachments.size > 0;
  const sendedMessage = interaction.channel
    .awaitMessages({ max: 1, time: 300_000, errors: ["time"], filter })
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
    .setName("enviar")
    .setDescription("Use: /enviar <evento>")
    .addStringOption((option) =>
      option
        .setName("evento")
        .setDescription("Para qual tipo de evento você deseja participar?")
        .setRequired(true)
        .addChoices({ name: "Leitura Interativa", value: "LI" })
        .addChoices({ name: "Mural dos Desenhos da Semana", value: "MD" })
    ),

  dev: false,

  async execute(interaction) {
    const { options, client, user } = interaction;
    const event = options.get("evento").value;
    const userId = user.id;

    if (event == "LI") {
      const modal = new Modal()
        .setCustomId("modal-li")
        .setTitle("Leitura Interativa")
        .addComponents(
          new TextInputComponent()
            .setCustomId("text-name")
            .setStyle("SHORT")
            .setLabel("O nome do texto:")
            .setPlaceholder("Exemplo: Partícula das Almas - Cap 1")
            .setRequired(true),
          new TextInputComponent()
            .setCustomId("link")
            .setStyle("SHORT")
            .setLabel("Link da obra:")
            .setPlaceholder("Recomendado utilizar o Google Docs.")
            .setRequired(true)
        );
      return showModal(modal, { client: client, interaction: interaction });
    }
    if (event == "MD") {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("send-img")
          .setEmoji({ id: "1051884167782219776", name: "error" })
          .setLabel("Enviar imagem")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("send-info")
          .setEmoji({ id: "1051884167782219776", name: "error" })
          .setLabel("Enviar informações")
          .setStyle(ButtonStyle.Danger)
      );

      const week = await getWeek();
      let data = undefined;
      if (week > 0) {
        data = await getData(week);
      } else {
        data = getNextSunday().getTime();
        await createEvent(1, data);
      }

      add(
        week,
        userId,
        undefined,
        undefined,
        undefined,
        undefined,
        interaction
      );

      interaction.reply({
        content: `Aperte nos botões abaixo e faça como pedem. Após concluir, será enviado a segunda etapa.`,
        fetchReply: true,
        components: [row],
        ephemeral: true,
      });
    }
  },
};
