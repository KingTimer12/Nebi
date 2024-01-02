const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
require("dotenv").config();
const { emojis } = require("../utils/emotes.json");
const { toMoment, sundayTimestamp } = require("../utils/timerApi");
const { fetchUserDraw, createAndSaveUserDraw } = require("../database/manager/drawManager");
const { create_profile, update_profile, getGlows } = require("../database/manager/userManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("glows")
    .setDescription("Comando para gerenciar glows")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("adicionar")
        .setDescription("Adiciona glows para o usuário.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("O usuario que vai receber os glows.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("quantidade")
            .setDescription("A quantidade de glows que vai dá.")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("Remove glows para o usuário.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("O usuario que vai receber as moedas.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("quantidade")
            .setDescription("A quantidade de moedas que vai dá.")
            .setRequired(true)
            .setMinValue(1)
        )
    ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  dev: false,

  async execute(interaction) {
    const { options, guild } = interaction;
    const subcommand = options.data[0];

    const userId = options.get("user").value;
    const amount = options.get("quantidade").value;

    const member = await guild.members.fetch(userId)
    const user = member.user
    const username = user.username

    await create_profile(userId, username)

    const checkDate = new Date();
    checkDate.setMonth(checkDate.getMonth() + 4);
    const glows = await getGlows(userId)

    switch (subcommand.name) {
      case "adicionar":
        return await update_profile(userId, {
          glows: glows + amount,
          last_message: checkDate
        }).then(async () => {
          await interaction.reply({
            content:
              `Adicionado ${amount} glows para conta de <@${userId}>`,
            ephemeral: true,
          }).catch(console.error);
        })
      case "remover":
        return await update_profile(userId, {
          glows: (glows - amount) > 0 ? (glows - amount) : 0,
          last_message: checkDate
        }).then(async () => {
          await interaction.reply({
            content:
              `Removido ${amount} glows da conta de <@${userId}>`,
            ephemeral: true,
          }).catch(console.error);
        })
    }
  },
};
