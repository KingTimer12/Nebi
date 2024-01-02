const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addChannel, addRole } = require("../database/manager/guildManager");
const { getProfile, update_profile } = require("../database/manager/userManager");

require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("medalha")
        .setDescription(
            "Armazenar informações cruciais para o funcionamento do bot."
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("habilitar")
                .setDescription("Crie seu profile sem necessitar dos requisitos.")
                .addStringOption((option) =>
                    option
                        .setName("id")
                        .setDescription("O id da medalha. Exemplo: nitro.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("desabilitar")
                .setDescription("Crie seu profile sem necessitar dos requisitos.")
                .addStringOption((option) =>
                    option
                        .setName("id")
                        .setDescription("O id da medalha. Exemplo: nitro.")
                        .setRequired(true)
                )
        ),

    dev: true,

    async execute(interaction) {
        const { options, guild, user, member } = interaction;
        const userId = user.id;
        const subcommand = options.data[0];
        const badgeId = options.get("id").value

        const profile = await getProfile(userId)

        if (!profile.exists()) return await interaction.reply({ content: "Você não tem um profile! Para ter, atinja os requisitos ou use `/profile criar`.", ephemeral: true })

        const badgesArray = profile.val().badges ?? []

        const chooseBadge = badgesArray.find(b => b.name == badgeId)
        if (!chooseBadge) return await interaction.reply({ content: "Você não tem essa medalha!", ephemeral: true })

        switch (subcommand.name) {
            case "habilitar":
                if (chooseBadge.enabled) return await interaction.reply({ content: "Essa medalha já está habilitada!", ephemeral: true })
                delete badgesArray[badgesArray.indexOf(chooseBadge)]
                chooseBadge.enabled = true
                badgesArray.push(chooseBadge)
                badgesArray.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                await update_profile(userId, {
                    badges: badgesArray
                })
                return await interaction.reply({ content: `Você habilitou a medalha ${chooseBadge.name}!`, ephemeral: true })
            case "desabilitar":
                if (!chooseBadge.enabled) return await interaction.reply({ content: "Essa medalha já está desabilitada!", ephemeral: true })
                delete badgesArray[badgesArray.indexOf(chooseBadge)]
                chooseBadge.enabled = false
                badgesArray.push(chooseBadge)
                badgesArray.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                await update_profile(userId, {
                    badges: badgesArray
                })
                return await interaction.reply({ content: `Você desabilitou a medalha ${chooseBadge.name}!`, ephemeral: true })
        }
    },
};
