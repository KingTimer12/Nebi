const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getter } = require("../utils/firebaseGuildApi");

const bell = "https://cdn-icons-png.flaticon.com/512/747/747185.png";

const redHex = "#e91a25";

const firstRolesMessages = async (channel) => {
  const embed1 = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle("FINALIZAÇÃO")
    .setDescription(
      "Para finalizar o registro, selecione uma das opções abaixo!\n\n" +
        "`📚` ⬩ Escritor\n" +
        "`🎨` ⬩ Desenhista\n" +
        "`🏃‍♂️` ⬩ Só de passagem\n"
    );

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select-roles-main")
      .setPlaceholder("Selecione uma opção")
      .addOptions([
        {
          label: "Escritor",
          value: "writer",
          emoji: "📚",
        },
        {
          label: "Desenhista",
          value: "designer",
          emoji: "🎨",
        },
        {
          label: "Só de passagem",
          value: "member",
          emoji: "🏃‍♂️",
        },
      ])
  );

  return await channel.send({ embeds: [embed1], components: [row] });
};

const secondRolesMessages = async (channel) => {

  const creativeRoleid = await getter(channel.guildId, 'role', 'creative')
  const drawRoleid = await getter(channel.guildId, 'role', 'draw-week')
  const readingRoleid = await getter(channel.guildId, 'role', 'interactive-reading')
  const novelClubRoleid = await getter(channel.guildId, 'role', 'novel-club')

  const embed1 = new EmbedBuilder()
    .setColor("Aqua")
    .setTitle("Notificações")
    .setDescription(
      "A Novel Brasil realiza alguns eventos, sejam mensais, semanais ou diários. " +
        "Esses são os cargos que precisa para ser marcado quando o evento ocorre, " +
        "basta **SELECIONAR A OPÇÃO** correspondente ao cargo que deseja.\n\n" +
        `<@&${readingRoleid}>: Vamos ler a obra dos membros presentes, apresentando um feedback ao fim. O foco é a história e não a gramática!\n\n` +
        `<@&${drawRoleid}>: Evento semanal para desenhar sobre temas escolhidos. Livre a todos sem exigência de habilidade.\n\n` +
        `<@&${creativeRoleid}>: O membro deve fazer um texto todo dia usando como referência as imagens e textos postados pelos membros da staff.\n\n` +
        `<@&${novelClubRoleid}>: Uma conversa descontraída sobre um tema que será informado no anúncio do Evento.`
    );

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select-roles")
      .setPlaceholder("Selecione uma ou mais opções!")
      .setMinValues(0)
      .setMaxValues(4)
      .addOptions([
        {
          label: "Leitura Interativa",
          description:
            "Vamos ler a obra dos membros presentes, apresentando um feedback ao fim.",
          value: "reading",
          emoji: '📖'
        },
        {
          label: "Desenho da Semana",
          description: "Evento semanal para desenhar sobre temas escolhidos.",
          value: "draw",
          emoji: '🖌'
        },
        {
          label: "Criativo",
          description:
            "O membro deve fazer um texto todo dia usando como referência as imagens e textos do chat.",
          value: "creative",
          emoji: '🎨'
        },
        {
          label: "Clube da Novel",
          description:
            "Uma conversa descontraída sobre um tema que será informado no fixado do Eventos.",
          value: "novel-club",
          emoji: '📚'
        },
      ])
  );

  return await channel.send({ embeds: [embed1], components: [row] });
};

module.exports = {
  firstRolesMessages,
  secondRolesMessages,
};
