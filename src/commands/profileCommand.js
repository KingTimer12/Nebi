const {
    SlashCommandBuilder,
    MessageAttachment,
    AttachmentBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder
} = require("discord.js");
const { getProfile, getRanking, calcCheck, create_profile } = require("../database/manager/userManager");
const nodeHtmlToImage = require('node-html-to-image')
require("dotenv").config();
const badges = require('../config/badges.json')
const backgrounds = require('../config/backgrounds.json');
const { getEmoji } = require("../handlers/emojiHandler");

function nFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
}

const getCardHTML = ({
    avatarURL,
    backgroundURL,
    flagURL,
    badgesURLs = [], username, rank,
    joinDate, aboutMe, level,
    glowTotal, currExp, targExp, fireURL }) => {

    let badges = []
    let plus = false
    if (badgesURLs.length >= 5) {
        for (let i = 0; i < 5; i++) {
            badges.push(badgesURLs.at(i))
        }
        plus = true
    } else {
        badges = badgesURLs
    }

    return `<html>
    <head>
        <style>

        html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block;
}

body {
    line-height: 1;
}

ol,
ul {
    list-style: none;
}

blockquote,
q {
    quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
    content: '';
    content: none;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

* {
    --cor: lightgrey;
    --cor2: black;
}

html {
    font-size: 62.5%;
    background-color: transparent;
    font-family: sans-serif;
}

body {
    height: 645px;
    width: 640px;
}

.image-container {
    box-sizing: border-box;
    border-style: none;
    background-color: transparent;
    padding: 2.5%;
}

.profile {
    transform: translate(0.8rem, 0.005rem);
    color: white;
    display: flex;
    gap: 25.6px;
}

.profile__picture {
    padding-top: 5px;
    margin-left: -5.5px;
    height: 170px;
    width: 170px;
    border-radius: 30%;
}

.profile__info {
    display: flex;
    width: 70%;
    flex-direction: column;
    margin-left: -2rem;
}

.info__upper {
    display: flex;
    font-size: 2.24em;
    align-items: center;
    justify-content: space-between;
}

.badges-container {
    display: flex;
    height: fit-content;
    width: fit-content;
    line-height: 100%;
    padding-top: 1.3rem;
}

.badge__image {
    height: 32px;
    width: 32px;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
}

.badges {
    box-shadow: 0px 0px 10px 1px black;
    display: flex;
    min-width: 3ch;
    ${badgesURLs.length > 1 ? "width: fit-content;" : ""}
    align-items: center;
    background-color: rgb(164, 162, 162);
    padding: 0.2rem 0.8rem 0 0.6rem;
    border-radius: 10px;
}

.plus {
    background-color: lightgrey;
    position: relative;
    left: -0.4em;
    border-radius: 50cqh;
    padding: 0 0.3rem;
    line-height: 150%;
    font-size: 1em;
    align-self: center;
    font-weight: bolder;
    color: black;
}

.ranking {
    color: white;
    padding-top: 0.6rem;
    display: flex;
    gap: 1.3rem;
    align-items: center;
}

.ranking__placing {
    font-size: ${rank > 1000 ? 1.5 : 2 + ((1000 - rank) / 999) * 2}rem;
    font-weight: bolder;
}

.username {
    margin-top: 1.2rem;
    font-size: 3.4rem;
    font-weight: bolder;
}

.date {
    padding-top: 0.5rem;
    font-size: 1.92rem;
    font-weight: bolder;
}

.date__value {
    font-size: 2.56rem;
}

.flag {
    position: relative;
    width: 4.48rem;
    height: 3rem;
    border-radius: 1cqh;
    left: 74%;
    top: -25%
}

.barras {
    margin-top: 2.44rem;
    color: black;
    display: flex;
    flex-direction: column;
    gap: 3.04rem;
    font-size: 2.56rem;
    font-weight: bold;
    padding: 0 6.4rem;
}

.barras__upper {
    display: flex;
    justify-content: space-between;
}

.nlv {
    background-color: var(--cor);
    width: fit-content;
    padding: 0 1.92rem 0 0;
    line-height: 150%;
    border-radius: 1cqh;
    box-shadow: 0 0 10px 1px;
}

.glows-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.glows {
    background-color: var(--cor);
    width: fit-content;
    padding: 0 1.72rem 0 3rem;
    line-height: 150%;
    border-radius: 2cqh;
    box-shadow: 0 0 10px 1px;
}

.glows_image {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 7.7rem;
    top: 33%;
    border-color: rgb(180 83 9);
}

.alt-text {
    background-color: var(--cor2);
    line-height: 150%;
    color: var(--cor);
    padding: 0.64rem 1.28rem;
    border-radius: 2cqh;
}

.exp {
    display: flex;
    line-height: 100%;
    align-items: center;
    padding: 0 1.2rem 0 0;
    justify-content: space-between;
    box-shadow: 0px 0px 10px 1px black;

}

.progress {
    display: flex;
    justify-content: space-between;
    background-color: var(--cor);
    color: var(--cor2);
    line-height: 125%;
    padding: 0.34rem 1.28rem;
    border-radius: 2cqh;
}

.sobre-mim {
    color: white;
    margin-top: 7.04rem;
    padding-inline: 6.4rem;
    font-size: 2.56rem;
    text-align: center;
}

.sobre-mim__body {
    margin-top: 1.48rem;
    font-style: italic;
}
        </style>
    </head>
    <body>
        <div class="image-container">
            <div class="profile">
                <div class="profile__picture">
                    <img src="${avatarURL}" alt="" class="profile__picture" />
                    <img src="${flagURL}" alt="" class="flag">
                </div>
            <div class="profile__info">
                <div class="info__upper">
                <div class="badges-container">
                    <span class="badges">
                        ${badges.length != 0 ? badges.map(badgeURL => `<span><img class="badge__image" src="${badgeURL}" /></span>`).join(" ") : '<span class="badge__image">&#160</span>'}
                    </span>
                    ${plus ? `<span class="plus">+</span>` : ``}
                </div>
                    <div class="ranking"><div>RANKING </div><div class="ranking__placing">#${rank >= 1000 ? '999+' : rank}</div></div>
                    </div>
                    <div class="username">${username}</div>
                    <div class="date">DESDE: ${joinDate} 📆</div>
                </div>
            </div>
            <div class="barras">
                <div class="barras__upper">
                        <div class="glows-container">
                            <div class="glows">
                            <img class="glows_image" src="${fireURL}" /><span class="alt-text">GLOWS</span> <span id="total-glows">${nFormatter(glowTotal, 3)}</span>
                            </div>
                        </div>
                        <div class="nivel">
                            <span class="nlv"><span class="alt-text">NV ${level}</span>&#160</span>
                        </div>
                </div>
                <div class="barras__lower">
                    <div class="alt-text exp">
                        <div class="progress" style="width: ${75 + Math.round((currExp / targExp) * 280)}px;">
                            <span>EXP</span>
                        </div>
                        <span>
                            <span id="curr_exp">${nFormatter(currExp, 2)}</span>/<span id="targ_exp">${nFormatter(targExp, 2)}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="sobre-mim">
                <div class="sobre-mim__body">
                    ${aboutMe}
                </div>
            </div>
            <img src="${backgroundURL}" style="position: absolute; top: 0px; left: -5px; height: 645px;  width: 655px; z-index: -1;" />
        </div>
        </body>
    </html>`
}

function breakLines(text, maxCharacters) {
    const words = text.split(' ');
    let currentLine = '';
    const lines = [];

    for (let word of words) {
        if (currentLine.length + word.length <= maxCharacters) {
            currentLine += (currentLine.length === 0 ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    lines.push(currentLine);

    return lines.join('\n');
}

function limitCaractres(text, limit) {
    if (text.length <= limit) {
        return text;
    } else {
        return text.substring(0, limit) + "...";
    }
}

const createCard = async (profile, member) => {
    const { user } = member
    const joined = member.joinedTimestamp;
    const date = new Date(joined);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const userId = user.id
    const nickname = !member.nickname ? user.username : member.nickname;
    const avatar = member.displayAvatarURL({ extension: 'png' })
    const glows = Number(profile.val().glows)
    const xp = Number(profile.val().xp)
    const level = Number(profile.val().level)
    const flag = String(profile.val().flag)
    const aboutMe = String(profile.val().about_me)
    const ranking = await getRanking(userId)
    const background = String(profile.val().background)
    const badgesArray = profile.val().badges ?? []
    //xm
    const fire = "https://cdn.discordapp.com/attachments/1171871006483288145/1171900407086338160/fogo.png"

    const badgesURLs = []
    for (const badge of badgesArray) {
        if (!badge.enabled) continue
        badgesURLs.push(badges[badge.name])
    }


    const cardImage = await nodeHtmlToImage({
        output: './cardNB.png',
        type: 'png',
        html: getCardHTML({
            fireURL: fire,
            avatarURL: avatar,
            backgroundURL: backgrounds[background],
            flagURL: `https://tetr.io/res/flags/${flag}.png`,
            badgesURLs: badgesURLs,
            username: limitCaractres(nickname, 16),
            rank: ranking,
            joinDate: `${day}/${month}`,
            aboutMe: breakLines(aboutMe, 30),
            level: level,
            glowTotal: glows,
            currExp: xp,
            targExp: calcCheck(level)
        }),
        encoding: 'binary',
        transparent: true
    })

    return new AttachmentBuilder(cardImage, { name: 'profile.png' });
}

const configPanel = async (interaction, profile, member) => {
    const {user} = member
    const userId = user.id
    return await interaction.deferReply({ ephemeral: true }).then(async () => {
        const badgesArray = profile.val().badges
        const badgesEmojis = []
        for (const badge of badgesArray) {
            if (!badge) continue
            console.log(badge)
            badgesEmojis.push(getEmoji(badge.name))
        }
        const ranking = await getRanking(userId)
        const glows = Number(profile.val().glows)
        const avatar = member.displayAvatarURL({ extension: 'png' })

        const select = new StringSelectMenuBuilder()
        select.setCustomId("config-profile")
        select.setPlaceholder("O que deseja ver?")
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

        const row = new ActionRowBuilder().addComponents(select);

        const embed = new EmbedBuilder()
        embed.setThumbnail(avatar)
        embed.setAuthor({
            name: 'Informações Profile',
            iconURL: 'https://cdn.pixabay.com/animation/2023/06/30/05/12/05-12-37-113_512.gif'
        })

        const flag = String(profile.val().flag)
        const flag_str = flag == "xm" ? `<:flag_xm:1174062877007679528>` : `:flag_${flag}:`

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
                name: "Sobre Mim",
                value: String(profile.val().about_me),
                inline: false
            },
            {
                name: "Background",
                value: "Padrão",
                inline: false
            })
            .setImage(backgrounds["default"])
        embed.setTimestamp()

        await interaction.followUp({ embeds: [embed], components: [row] })
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Comando do mural de eventos")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("criar")
                .setDescription("Crie seu profile sem necessitar dos requisitos.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("info")
                .setDescription("Veja as informações do seu profile e como configurar.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("ver")
                .setDescription("Veja seu profile ou de outra pessoa.")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("O usuário que verá o profile.")
                        .setRequired(false)
                )
        ),
    dev: true,

    async execute(interaction) {
        const { options, guild, user, member } = interaction;
        const userId = user.id;
        const subcommand = options.data[0];

        let profile = await getProfile(userId)

        switch (subcommand.name) {
            case "ver":
                let memberFinal = member
                const userField = options.get("user")
                if (userField) {
                    const targetMember = await guild.members.fetch(userField.value)
                    if (targetMember) memberFinal = targetMember
                    profile = await getProfile(memberFinal.user.id)
                    if (!profile.exists()) return await interaction.reply('Esse usuário não tem um profile.')
                }
                if (!profile.exists()) return await interaction.reply({ content: "Você não tem um profile! Para ter, atinja os requisitos ou use `/profile criar`.", ephemeral: true })
                return await interaction.deferReply().then(async () => {
                    const attachment = await createCard(profile, memberFinal)
                    await interaction.followUp({ files: [attachment] })
                })
            case "info":
                if (!profile.exists()) return await interaction.reply({ content: "Você não tem um profile! Para ter, atinja os requisitos ou use `/profile criar`.", ephemeral: true })

                return await configPanel(interaction, profile, member)
            case "criar":
                if (profile.exists()) return await interaction.reply({ content: "Você já tem um profile! Se quiser o usar, execute o comando `/profile configurar`.", ephemeral: true })

                await create_profile(userId, user.username)
                return await interaction.reply({ content: "Profile criado com sucesso!", ephemeral: true })
        }
    },
};
