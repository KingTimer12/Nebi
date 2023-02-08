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
    const { options, user } = interaction;
    const target = options.getUser("user") || user;

    let userProfile = getUser(target.id);
    if (!userProfile) {
      console.log(userProfile)
      if (hasUser(target.id)) {
        userProfile = addUser(target);
        await userProfile.load();
        console.log(userProfile)
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

    const nextLevel = userProfile.level + 1;
    const glowRequired = nextLevel * nextLevel * 100;

    const rankCard = new Canvacord.Rank()
      .setAvatar(target.displayAvatarURL({ dynamic: false, extension: "png" }))
      .setRequiredXP(glowRequired)
      .setCurrentXP(userProfile.glows)
      .setLevel(userProfile.level)
      .setProgressBar("orange", "COLOR")
      .setUsername(target.username)
      .setDiscriminator(target.discriminator)
      .setStatus("dnd")
      .setRank(1);

    await rankCard.build().then(async (data) => {
      const attachment = new AttachmentBuilder(data, {
        name: "RankCard.png",
      });
      await interaction.reply({ files: [attachment] });
    });
  },
};
*/