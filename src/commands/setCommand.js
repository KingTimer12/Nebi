const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { setter } = require("../utils/firebase/firebaseGuildApi");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription(
      "Armazenar informações cruciais para o funcionamento do bot."
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Estamos mexendo com o quê?")
        .setRequired(true)
        .addChoices(
          { name: "Canal", value: "channel" },
          { name: "Cargo", value: "role" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("id-name")
        .setDescription("Selecione um nome de busca.")
        .setRequired(true)
        .addChoices(
          { name: "Cargos", value: "roles" },
          { name: "Como funciona", value: "how-works" },
          { name: "Fórum", value: "forum" },
          { name: "Classe", value: "rank" },

          { name: "Leitura Interativa", value: "interactive-reading" },
          { name: "Desenho da Semana", value: "draw-week" },
          { name: "Criativo", value: "creative" },
          { name: "Clube da Novel", value: "novel-club" },
          { name: "Filminho", value: "movie" },
          { name: "Torneio", value: "tournament" },

          { name: "Membro", value: "member" },
          { name: "Desenhista", value: "designer" },
          { name: "Leitor", value: "reader" },
          { name: "Escritor", value: "writer" },
          { name: "Revisor", value: "reviser" },
          { name: "Tradutor", value: "translate" },
          { name: "Roteirista", value: "screenwriter" },

          { name: "Aulas", value: "classes" },
          { name: "Artigos", value: "articles" },
          { name: "Youtube", value: "youtube" },
          { name: "Redes sociais", value: "social-media" },
          { name: "Anúncios Parceiros", value: "partners" },

          { name: "Divulgação Obras", value: "divulgation-works" },

          { name: "Registro", value: "register" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription(
          "O id em snowflake do tag/canal/cargo para armazenar no banco de dados."
        )
        .setRequired(true)
    ).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  dev: true,

  async execute(interaction) {
    const { options, guildId } = interaction;
    const type = options.get("type").value;
    const name = options.get("id-name").value;
    const genericId = options.get("id").value;
    await setter(guildId, type, name, genericId);
    let markResult = `<#${genericId}> foi`;
    if (type == "role") {
      markResult = `<@&${genericId}> foi`;
    }
    interaction.reply({
      content: `O ${markResult} adicionado no banco de dados!`,
      ephemeral: true,
    });
  },
};
