const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getDraw, updateDraw } = require("../../database/handler/drawHandler");
const DrawModel = require("../../database/model/drawModel");
const { emojis } = require("../../utils/emotes.json");
const { getChannel } = require("../../database/manager/guildManager");
const { Worker } = require("snowflake-uuid");
const { get, remove } = require("../../utils/correioCached");

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
  customId: "modal-correio",
  async execute(interaction) {
    const { user, fields, client } = interaction;
    const userId = user.id;

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

    const targetId = get(userId);

    //Enviando as informações para seus canais
    mailAnoChannel
      .send(
        `Destinatário: **<@!${targetId}>**\nMensagem: **${message}**\nSenha: ||${password}||\n**Envie a senha para divisão de TI caso alguém seja um babaca.**`
      )
      .catch(console.error);
    mailPassChannel
      .send(
        `Senha: ||${password}||\nUser ID: **${user.id}**\nUsuário: <@!${user.id}>`
      )
      .catch(console.error);

    remove(userId);

    //Fechando o modal
    return await interaction.reply({ content: 'Sua mensagem foi enviada para o correio!', ephemeral: true, fetchReply: true })
  },
};
