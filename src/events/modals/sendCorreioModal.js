const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getChannel } = require("../../database/manager/guildManager");
const { get, remove } = require("../../utils/correioCached");
const { createMessage } = require("../../database/manager/mailManager");
const { emojis } = require('../../utils/emotes.json')

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

    const message = fields.getTextInputValue("message"); //Pegando a mensagem que foi enviada

    const targetId = get(userId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("mute-btn")
        .setLabel("Mutar")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("ban-btn")
        .setLabel("Banir")
        .setStyle(ButtonStyle.Danger)
    );

    try {
      await createMessage(userId, targetId, message)

      await mailAnoChannel
        .send({
          content: `UserID: **${user.id}**\nDestinatário: **<@!${targetId}>**\nTargetID: **${targetId}**\nMensagem: **${message}**`,
          components: [row]
        })
        .catch(console.error);

      remove(userId);

      //Fechando o modal
      return await interaction.reply({ content: 'Sua mensagem foi enviada para o correio!', ephemeral: true, fetchReply: true }).catch(console.error)
    } catch (error) {
      return await interaction.reply({ content: `${emojis["error"]} **${error.message.replace('Remetente', 'Você')}**.`, ephemeral: true, fetchReply: true }).catch(console.error)
    }
  },
};
