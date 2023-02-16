/*const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { emojis } = require("../utils/emotes.json");
const Canvacord = require("canvacord");
const { getUser, addUser } = require("../database/handler/userHandler");
const { hasUser } = require("../database/manager/userManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Veja seu rank.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Veja o rank de outra pessoa.")
        .setRequired(false)
    ),

  dev: false,

  async execute(interaction) {
    const { options, user, guild } = interaction;
    const target = options.getUser("user") || user;
    const targetMember = guild.members.cache.find(member => member.id == target.id)

    let userProfile = getUser(target.id);
    if (!userProfile) {
      if (hasUser(target.id)) {
        userProfile = addUser(target);
        await userProfile.load();
      } else {
        const msgError = options.getUser("user")
          ? `<@${target.id}> não está registrado no banco de dados.`
          : `Você não está registrado. Converse pelo menos uma vez nos chats de **bate-papo**.`;
        return await interaction.reply({
          content: `${emojis["error"]} ${msgError}.`,
          ephemeral: true,
        });
      }
    }
    await userProfile.loadPosition()

    const nextLevel = userProfile.level + 1;
    const glowRequired = nextLevel * nextLevel * 100;

    const status = targetMember.presence ? targetMember.presence.status : 'offline'

    const rankCard = new Canvacord.Rank()
      .setAvatar(target.displayAvatarURL({ dynamic: false, extension: "png" }))
      .setRequiredXP(glowRequired)
      .setCurrentXP(userProfile.glows)
      .setLevel(userProfile.level, 'Nível')
      .setProgressBar("orange", "COLOR")
      .setUsername(target.username)
      .setDiscriminator(target.discriminator)
      .setStatus(status, false)
      .setBackground("IMAGE", userProfile.wallpaper)
      .setRank(userProfile.position, 'Posição');

    await rankCard.build().then(async (data) => {
      const attachment = new AttachmentBuilder(data, {
        name: "RankCard.png",
      });
      await interaction.reply({ files: [attachment] });
    });
  },
};*/