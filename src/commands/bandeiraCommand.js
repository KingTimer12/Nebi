const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addChannel, addRole } = require("../database/manager/guildManager");
const { getProfile, update_profile } = require("../database/manager/userManager");
const { getFlags } = require("../handlers/flagHandler");

require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bandeira")
        .setDescription(
            "Armazenar informações cruciais para o funcionamento do bot."
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("trocar")
                .setDescription("Crie seu profile sem necessitar dos requisitos.")
                .addStringOption((option) =>
                    option
                        .setName("code")
                        .setDescription("O code do país. Exemplo: BR, EN.")
                        .setRequired(true)
                )
        ),

    dev: true,

    async execute(interaction) {
        const { options, guild, user, member } = interaction;
        const userId = user.id;
        const subcommand = options.data[0];
        const flagCode = String(options.get("code").value).toLowerCase()

        const profile = await getProfile(userId)

        if (!profile.exists()) return await interaction.reply({ content: "Você não tem um profile! Para ter, atinja os requisitos ou use `/profile criar`.", ephemeral: true })

        const flagCurrent = String(profile.val().flag)
        const glowsCurrent = Number(profile.val().glows)

        if (glowsCurrent < 10000) {
            return await interaction.reply({ content: "Você precisa ter 10.000 glows para fazer essa troca.", ephemeral: true })
        }

        let glowsUpdated = glowsCurrent - 1000
        if (glowsUpdated <= 0) glowsUpdated = 0

        const otherFlags = getFlags()
        const searchFlag = otherFlags.find(f => f.name == flagCode)
        if (!searchFlag) return await interaction.reply({ content: "Esse código não existe!", ephemeral: true })
        if (flagCurrent == flagCode) return await interaction.reply({ content: "Trocar a para atual? Isso não é possível.", ephemeral: true })

        switch (subcommand.name) {
            case "trocar":
                await update_profile(userId, {
                    flag: flagCode,
                    glows: glowsUpdated
                })
                return await interaction.reply({ content: `Você trocou a bandeira para ${searchFlag.emoji} em troca de 10.000 glows!`, ephemeral: true })
        }
    },
};
