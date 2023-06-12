const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const { getChannel } = require("../database/manager/guildManager");
const { Worker } = require("snowflake-uuid");
const { toMoment } = require("../utils/timerApi");
require("dotenv").config();

const DIADEUSO = 12; //Dia que isso funcionará
const DIALIMITE = 19; //Dia que parará de funcionar
const MESDEUSO = 6; //Mês que isso funcionará

module.exports = {
  data: new SlashCommandBuilder()
    .setName("correio")
    .setDescription("Envie uma mensagem anônima")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("O destinatário da sua mensagem.")
        .setRequired(true)
    ),

  dev: false,

  async execute(interaction) {
    const currentDate = toMoment(Date.now());
    const { options, client, user } = interaction;
    const userId = user.id;

    //Verificando se ainda tá tendo evento.
    if (
      currentDate.date() < DIADEUSO &&
      currentDate.date() >= DIALIMITE &&
      currentDate.month() != MESDEUSO
    ) {
      return await interaction
        .reply({
          content:
            currentDate.date() < DIADEUSO
              ? "O evento ainda não foi iniciado."
              : "O evento já passou.",
          ephemeral: true,
        })
        .catch(console.error);
    }

    //Pegando o ID do cabaré pra pegar os chats
    //1046080828716896297 - Cabaré
    const guild = client.guilds.cache.find(
      (guild) => guild.id == "1046080828716896297"
    );
    if (guild == undefined) {
      return await interaction.reply({
        content: "Ocorreu um erro inesperado! ID: SCmK9",
        ephemeral: true,
      });
    }

    //Pegando o destinatário
    const targetUser = await options.getUser("user");
    if (userId == targetUser.id) {
      //Checando se o cara não tá usando em si
      return await interaction
        .reply({
          content: "Você não pode enviar uma carta para si!",
          ephemeral: true,
        })
        .catch(console.error);
    }
    if (targetUser.bot) {
      //Checando se o cara não é um bot
      return await interaction
        .reply({
          content:
            "Ainda não temos sentimentos para receber esse tipo de carta.",
          ephemeral: true,
        })
        .catch(console.error);
    }

    //Criando o modal
    const modal = new ModalBuilder()
      .setCustomId("modal-correio")
      .setTitle("Correio do Amor")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("message")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Mensagem:")
            .setPlaceholder("Coloque aqui a mensagem bonitinha")
            .setMaxLength(2000)
            .setRequired(true)
        )
      );
    await interaction.showModal(modal).catch(console.log); //Mostrando o modal

    //Pegando a interação do modal
    //Modal interaction
    const filter = (i) =>
      i.customId === "modal-correio" && i.user.id === interaction.user.id;
    const modalInteraction = await interaction
      .awaitModalSubmit({ filter, time: 15_000 })
      .catch(console.error);
    if (modalInteraction == undefined) {
      //Verificando se não deu nenhuma erro
      return await interaction
        .reply({
          content: "Erro ao salvar a mensagem! ID: SCmb1",
          ephemeral: true,
        })
        .catch(console.error);
    }
    const { fields } = modalInteraction;

    //Pegando os id dos chats que tão no cabaré
    //(Por isso aquele código antes - linha 49)
    const mailAnoId = await getChannel(guild, {
      channelName: "anonymous-mail",
    });
    const mailAnoChannel = guild.channels.cache.find(
      (chn) => chn.id === mailAnoId
    );

    if (mailAnoChannel == undefined) {
      return await interaction
        .reply({
          content: "Erro ao salvar a mensagem! ID: SCmn2",
          ephemeral: true,
        })
        .catch(console.error);
    }

    const mailPassId = await getChannel(guild, { channelName: "pass-mail" });
    const mailPassChannel = guild.channels.cache.find(
      (chn) => chn.id === mailPassId
    );

    if (mailPassChannel == undefined) {
      return await interaction
        .reply({
          content: "Erro ao salvar a mensagem! ID: SCml7",
          ephemeral: true,
        })
        .catch(console.error);
    }

    const message = fields.getTextInputValue("message"); //Pegando a mensagem que foi enviada

    //Gerando o snowflake da mensagem (a senha)
    const generator = new Worker(0, 1, {
      workerIdBits: 5,
      datacenterIdBits: 5,
      sequenceBits: 12,
    });

    const password = generator.nextId().toString();

    //Enviando as informações para seus canais
    mailAnoChannel
      .send(
        `Destinatário: **<@!${targetUser.id}>**\nMensagem: **${message}**\nSenha: ||${password}||\n**Envie a senha para divisão de TI caso alguém seja um babaca.**`
      )
      .catch(console.error);
    mailPassChannel
      .send(
        `Senha: ||${password}||\nUser ID: **${user.id}**\nUsuário: <@!${user.id}>`
      )
      .catch(console.error);

    //Fechando o modal
    return await modalInteraction.deferUpdate().catch(console.error);
  },
};
