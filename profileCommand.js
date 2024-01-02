const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { request } = require('undici');
const {
    SlashCommandBuilder,
    MessageAttachment,
    AttachmentBuilder
} = require("discord.js");
const { getProfile } = require("../database/manager/userManager");
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Comando do mural de eventos"),

    dev: true,

    async execute(interaction) {
        const { options, user } = interaction;
        const userId = user.id;

        const profile = await getProfile(userId)
        if (!profile.exists()) return interaction.reply('Você não tem um profile! Para ter, atinja os requisitos ou use `/profile criar`')

        const canvas = createCanvas(645, 640)
        const context = canvas.getContext('2d')

        const { body } = await request(user.displayAvatarURL({ extension: 'png' }));
	    const avatar = await loadImage(await body.arrayBuffer());
        context.drawImage(avatar, 10, 25, 182, 182);

        const background = await loadImage(`${process.cwd().replace(/\\/g, '/')}/src/assets/background/background_1.png`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.save();
        context.beginPath();

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile.png' });
        await interaction.reply({ files: [attachment] })
    },
};
