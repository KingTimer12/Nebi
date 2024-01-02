const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {
  addTutorandoRow,
  addDadoRow,
  updateDadosTutorRow,
  getTutores,
} = require("../utils/googleApi/rankApi");
require("dotenv").config();
const { emojis } = require("../utils/emotes.json");
const { getRole } = require("../database/manager/guildManager");
const { getAllMessages } = require("../database/manager/mailManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("respostas")
    .setDescription("Criará um texto com todas as mensagens do correio."),

  dev: true,

  async execute(interaction) {
    const { client } = interaction
    const { guilds } = client
    let members = []
    for (const guild of guilds.cache) {
      const membersGuild = await guild[1].members.fetch()
      for (const member of membersGuild) {
        const user = member[1].user
        if (user.bot) continue
        members.push(user)
      }
    }

    let msgs = ''
    const messages = await getAllMessages()
    if (!messages.length) {
      return await interaction.reply({
        content: `Ninguém enviou mensagem.`, ephemeral: true
      }).catch(console.error);
    }

    for (const message of messages) {
      msgs += `--------------\nPara: ${members.find(member => member.id === message.receiver).username}\nMensagem: ${message.body}\n--------------`
    }


    return await interaction.reply({
      files: [{
        attachment: Buffer.from(msgs),
        name: 'correio.txt',
        description: 'Mensagens do correio'
      }]
    }).catch(console.error)
  },
};
