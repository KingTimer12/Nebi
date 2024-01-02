const { getProfile, getRanking } = require("../../database/manager/userManager");
const badges = require('../../config/badges.json');
const backgrounds = require('../../config/backgrounds.json');
const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { getEmoji } = require("../../handlers/emojiHandler");
const { getFlags } = require("../../handlers/flagHandler");

async function awaitComponent(message, customId) {
    const filter = (interaction) => interaction.customId === customId;
    const interactionResult = message
        .awaitMessageComponent({
            filter,
            time: 600_000,
            errors: ["time"],
        })
        .catch(() => console.log());
    return interactionResult;
}

const getEmbed = (avatar, title) => {
    const embed = new EmbedBuilder()
    embed.setThumbnail(avatar)
    embed.setAuthor({
        name: title,
        iconURL: 'https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif'
    })
    embed.setTimestamp()
    return embed
}

const badgePanel = async (interaction, profile) => {
    const { member, message } = interaction
    const badgeArray = []

    const avatar = member.displayAvatarURL({ extension: 'png' })
    const badgesArray = Array(profile.val().badges)
    for (const badge of badgesArray) {
        if (badge == undefined) continue
        const name = badge.name
        const emoji = getEmoji(name)

        badgeArray.push({
            name: name,
            has: true,
            enabled: badge.enabled,
            emoji: emoji
        })
    }
    for (const badge of badges.raw_names) {
        if (badgeArray.find(b => b.name == badge)) continue
        const emoji = getEmoji(`disable_${badge}`)
        badgeArray.push({
            name: badge,
            has: false,
            enabled: false,
            emoji: emoji
        })
    }
    let allString = ""
    if (badgeArray.length) {
        allString = `${badgeArray.filter(b => b.has && !b.enabled).map(b => b.emoji).join(" ")}`
        allString += `${badgeArray.filter(b => !b.has && !b.enabled).map(b => b.emoji).join(" ")}`
    }
    console.log(badgeArray.filter(b => b.has && b.enabled).length)
    console.log(allString)
    const embed = getEmbed(avatar, 'Configurar Medalhas')
    embed.setDescription(`**Legendas:**\n↪ Habilitadas: \`\`\`Aparecerá as suas medalhas que estão habilitadas, se tiver alguma.\`\`\`\n↪ Todas: \`\`\`Aparecerá todas as medalhas. Isso conta com as desabilitadas e bloqueadas.\`\`\`\n**Comandos:**\n↪ Habilitar -> \`/medalha habilitar <id>\`\n↪ Desabilitar -> \`/medalha desabilitar <id>\`\n\n `)
    embed.setFields(
        {
            name: "Habilitadas",
            value: badgeArray.filter(b => b.has && b.enabled).length ? badgeArray.filter(b => b.has && b.enabled).map(b => b.emoji).join(" ") : "Nenhuma medalha habilitada",
            inline: true
        },
        {
            name: "Todas",
            value: allString,
            inline: true
        })

    const back = new ButtonBuilder()
        .setCustomId('config-back')
        .setLabel('Voltar')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(back);

    await interaction.update({ embeds: [embed], components: [row] })

    const interactionResult = await awaitComponent(message, 'config-back')
    if (!interactionResult) return undefined
    return await configPanel(interactionResult, profile)
}

const backgroundPanel = async (interaction, profile) => {
    const { member, message } = interaction
    const embed = new EmbedBuilder()
    embed.setAuthor({
        name: 'Configurar Background',
        iconURL: 'https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif'
    })
    embed.setDescription(`Ainda não é possível trocar de fundo.`)
    embed.setTimestamp()

    const back = new ButtonBuilder()
        .setCustomId('config-back')
        .setLabel('Voltar')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(back);

    await interaction.update({ embeds: [embed], components: [row] })

    const interactionResult = await awaitComponent(message, 'config-back')
    if (!interactionResult) return undefined
    return await configPanel(interactionResult, profile)
}

const flagPanel = async (interaction, profile) => {
    const { member, message } = interaction
    const currentFlag = String(profile.val().flag)
    const otherFlags = getFlags()

    const avatar = member.displayAvatarURL({ extension: 'png' })

    let allString = ""
    if (otherFlags.length)
        allString += `${otherFlags.filter(flag => flag.name != currentFlag).map(flag => flag.emoji).join(" ")}`

    const embed = new EmbedBuilder()
    embed.setAuthor({
        name: 'Configurar Bandeiras',
        iconURL: 'https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif'
    })
    embed.setDescription(`**Legendas:**\n↪ Atual: ${otherFlags.filter(flag => flag.name == currentFlag).map(flag => flag.emoji).join("")} \n\n↪ Todas: \n${allString}\n`)
    embed.setTimestamp()
    embed.setFields({
        name: "Comando para trocar:",
        value: "/bandeira trocar <code>"
    })
    embed.setThumbnail(avatar)

    const back = new ButtonBuilder()
        .setCustomId('config-back')
        .setLabel('Voltar')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(back);

    await interaction.update({ embeds: [embed], components: [row] })

    const interactionResult = await awaitComponent(message, 'config-back')
    if (!interactionResult) return undefined
    return await configPanel(interactionResult, profile)
}

const configPanel = async (interaction, profile) => {
    const { member } = interaction
    const { user } = member
    const userId = user.id
    const flag = String(profile.val().flag)
    const badgesArray = profile.val().badges ?? []
    const badgesEmojis = []
    for (const badge of badgesArray) {
        if (badge == undefined) continue
        badgesEmojis.push(getEmoji(badge.name))
    }
    const ranking = await getRanking(userId)
    const glows = Number(profile.val().glows)
    const avatar = member.displayAvatarURL({ extension: 'png' })

    const select = new StringSelectMenuBuilder()
    select.setCustomId("config-profile")
    select.setPlaceholder("O que deseja configurar?")
    select.addOptions(
        new StringSelectMenuOptionBuilder()
            .setDescription("Veja quais medalhas tem e quais aparecerão no profile.")
            .setLabel("Medalhas")
            .setValue("badge"),
        new StringSelectMenuOptionBuilder()
            .setDescription("Veja quais bandeiras tem e qual aparecerá no profile.")
            .setLabel("Bandeira")
            .setValue("flag"),
        new StringSelectMenuOptionBuilder()
            .setDescription("Veja quais fundos tem e qual usará no profile.")
            .setLabel("Background")
            .setValue("background")
    )

    const flag_str = flag == "xm" ? `<:flag_xm:1174062877007679528>` : `:flag_${flag}:`

    const row = new ActionRowBuilder().addComponents(select);

    const embed = new EmbedBuilder()
    embed.setThumbnail(avatar)
    embed.setAuthor({
        name: 'Configurar Profile',
        iconURL: 'https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif'
    })
    embed.setDescription(`Informações em extenso: \n↪ Glows: \`${glows}\`\n↪ Ranking: \`${ranking}\`\n\n**Use os select para navegar.**`)
    embed.setFields(
        {
            name: "Medalhas Habilitadas",
            value: badgesEmojis.length ? badgesEmojis.join(" ") : "Nenhuma medalha habilitada",
            inline: true
        },
        {
            name: "Bandeira Atual",
            value: flag_str,
            inline: true
        },
        {
            name: "Background",
            value: "Padrão",
            inline: false
        })
        .setImage(backgrounds["default"])
    embed.setTimestamp()

    await interaction.update({ embeds: [embed], components: [row] })
}

module.exports = {
    customId: "config-profile",
    async execute(interaction, client) {
        const { values, user } = interaction;
        const profile = await getProfile(user.id)
        if (!profile.exists()) return await interaction.editReply({ content: "Você não tem um profile! O que será que aconteceu?", embeds: [], components: [] })

        const selected = values[0];
        switch (selected) {
            case "badge":
                return await badgePanel(interaction, profile)
            case "background":
                return await backgroundPanel(interaction, profile)
            case "flag":
                return await flagPanel(interaction, profile)
        }
    }
}