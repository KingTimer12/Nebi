import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../base/types/Command";

export default new Command({
    name: "embed",
    description: "Example command",
    type: ApplicationCommandType.ChatInput,
    async run({interaction}) {
        if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

        const embed = new EmbedBuilder({
            title: "Título",
            description: "Descrição muito foda do embed",
            author: {
                name: "Nome do autor",
                url: "https://discordapp.com",
                icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            footer: {
                text: "Texto de baixo",
                icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            thumbnail: {
                url: "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            image: {
                url: "https://cdn.discordapp.com/embed/avatars/0.png"
            }
        })

        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => console.log('Ocorreu um erro ao tentar enviar o embed'.red))
    }
})