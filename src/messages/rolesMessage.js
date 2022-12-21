const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { getter } = require("../utils/firebase/firebaseGuildApi");

const firstRolesMessages = async (channel) => {

  const readerRoleId = await getter(channel.guildId, "role", "reader");
  const reviserRoleId = await getter(channel.guildId, "role", "reviser");
  const writerRoleId = await getter(channel.guildId, "role", "writer");
  const translateRoleId = await getter(channel.guildId, "role", "translate");
  const screenwriterRoleId = await getter(channel.guildId, "role", "screenwriter");
  const designerRoleId = await getter(channel.guildId, "role", "designer");

  const embed = [
    {
      title: "O que você faz?",
      description:
        "A Novel Brasil, além de ser um lugar de ensino, também é uma comunidade para conhecer novos artistas e bater papo sobre o que você faz e gosta. Identifique o que você faz nessa comunidade para receber informações e encontrar outras pessoas que fazem as mesmas coisas:\n"+
        "\n" + 
        `<@&${readerRoleId}>: Cargo para quem acompanha alguma novel e deseja conversar com outros leitores e escritores sobre!\n`+
        `<@&${reviserRoleId}>: Cargo para aquelas pessoas que salvam nossa querida comunidade dos perversos erros de português. Muito obrigado.\n`+
        `<@&${writerRoleId}>: Cargo para nossos queridos escritores de novel (ou qualquer outro gênero de escrita).\n`+
        `<@&${translateRoleId}>: Cargo para as pessoas que se sacrificam para trazer obras gringas para a nossa comunidade. Aqueles que começaram essa comunidade devem ser exaltados!\n`+
        `<@&${screenwriterRoleId}>: Cargo para os salvadores da pátria, aqueles que lutam contra os furos nas histórias.\n`+
        `<@&${designerRoleId}>: Cargo para ilustradores, mangakás (quadrinista) e ilustradores, além de desenhistas amadores.`,
      color: 16722217,
    },
  ];

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select-roles-main")
      .setPlaceholder("Selecione uma ou mais opções!")
      .setMinValues(1)
      .setMaxValues(6)
      .addOptions([
        {
          label: "Leitor",
          value: "reader",
          emoji: "📖",
        },
        {
          label: "Revisor",
          value: "reviser",
          emoji: "📑",
        },
        {
          label: "Escritor",
          value: "writer",
          emoji: "📚",
        },
        {
          label: "Tradutor",
          value: "translate",
          emoji: "🌐",
        },
        {
          label: "Roteirista",
          value: "screenwriter",
          emoji: "📜",
        },
        {
          label: "Desenhista",
          value: "designer",
          emoji: "🎨",
        }
      ])
  );

  return await channel.send({ embeds: embed, components: [row] });
};

const secondRolesMessages = async (channel) => {
  
  const classesRoleId = await getter(channel.guildId, "role", "classes");
  const articlesRoleId = await getter(channel.guildId, "role", "articles");
  const youtubeRoleId = await getter(channel.guildId, "role", "youtube");
  const socialMediaRoleId = await getter(channel.guildId, "role", "social-media");
  const partnersRoleId = await getter(channel.guildId, "role", "partners");

  const embed = [
    {
      "title": "Anúncios:",
      "description": "Esses são cargos para aqueles que desejam ser **marcados** quando ocorre alguma atualização no servidor ou está rolando algum evento.\n" +
      "\n"+
      `<@&${classesRoleId}>: Temos aulas ao vivo, pegando esse cargo você será avisado sempre que estiver rolando alguma.\n`+
      `<@&${articlesRoleId}>: Receba todos os nossos artigos assim que sair quentinho do forno!\n`+
      `<@&${youtubeRoleId}>: Sim, nosso Youtube tem um cargo apenas para ele! Os vídeos no Youtube não costumam sair tanto quanto nas outras redes sociais, então temos um cargo para isso.\n`+
      `<@&${socialMediaRoleId}>: Pegue esse cargo e descubra o que está rolando com a Novel Brasil em outras redes sociais (instagram, twitter, facebook, etc).\n`+
      `<@&${partnersRoleId}>: Saiba o que está rolando nos maiores sites de novel do Brasil! Somos parceiro de todos e com esse cargo você vai receber marcações com notícias, eventos e atualizações sobre esses servers/sites.`,
      "color": 16774697
    }
  ]

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select-roles-announcement")
      .setPlaceholder("Selecione uma ou mais opções!")
      .setMinValues(0)
      .setMaxValues(5)
      .addOptions([
        {
          label: "Aulas",
          description:
            "Você será avisado sempre que estiver rolando alguma aula.",
          value: "classes",
          emoji: "🎓",
        },
        {
          label: "Artigos",
          description: "Você será avisado sempre que lançar alguma artigo.",
          value: "articles",
          emoji: "🧾",
        },
        {
          label: "Youtube",
          description:
            "Você será avisado sempre que sair alguma vídeo.",
          value: "youtube",
          emoji: "1054422820718923797",
        },
        {
          label: "Redes Sociais",
          description:
            "Você será avisado sempre que postarem algo.",
          value: "social-media",
          emoji: "1054423175947096124",
        },
        {
          label: "Parceiros",
          description:
            "Você será avisado sempre que sair alguma novidade sobre os parceiros.",
          value: "partners",
          emoji: "🌐",
        },
      ])
  );

  return await channel.send({ embeds: embed, components: [row] });
};

const thirdRolesMessages = async (channel) => {

  const interactiveReadingRoleId = await getter(channel.guildId, "role", "interactive-reading");
  const drawWeekRoleId = await getter(channel.guildId, "role", "draw-week");
  const creativeRoleId = await getter(channel.guildId, "role", "creative");
  const novelClubRoleId = await getter(channel.guildId, "role", "novel-club");
  const movieRoleId = await getter(channel.guildId, "role", "movie");
  const tournamentRoleId = await getter(channel.guildId, "role", "tournament");

  const embed = [
    {
      "title": "Eventos:",
      "description": "A Novel Brasil realiza diversos eventos (anuais, mensais, semanais e diários). Pegando esses cargos você será avisado quando o evento estiver começando:\n"+
      "\n"+
      `<@&${tournamentRoleId}>: **[Evento de Escrita]** Torneios que ocorrem todo ano. Escritores competem com várias histórias durante algumas semanas, o vencedor ganha um prêmio em dinheiro.\n`+
      `<@&${creativeRoleId}>: **[Evento de Escrita Criativa]** Esse é um evento diário. Todo mês ocorre uma season e a pessoa que mais participou (e ganhou estrelinhas do nosso jurado) ganha um discord nitro.\n`+
      `<@&${movieRoleId}>: **[Evento de Interação]** Esse ocorre de forma aleatória e qualquer um pode começar a qualquer momento. Assistimos filminhos em call, pegue caso queira ser marcado quando tiver começando uma sessão de cineminha.\n`+
      `<@&${novelClubRoleId}>: **[Evento de Interação]** Uma conversa semanal onde falamos de algum assunto (que muda toda semana) e fazemos algum desafio. Ex: Falar sobre novels que são cópias descaradas de outras.\n`+
      `<@&${interactiveReadingRoleId}>: **[Evento de Escrita]** Esse é para todos que desejam críticas sobre sua história. Ocorre semanalmente.\n`+
      `<@&${drawWeekRoleId}>: **[Evento de Desenho]** Toda semana ocorre uma votação sobre o que vamos desenhar. Todos os participantes fazem um desenho e fazemos uma grande \"thread\" com esses denhos.`,
      "color": 2752348
    }
  ];

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select-roles-events")
      .setPlaceholder("Selecione uma ou mais opções!")
      .setMinValues(0)
      .setMaxValues(6)
      .addOptions([
        {
          label: "Torneio",
          value: "tournament",
          emoji: "⚔",
        },
        {
          label: "Criativo",
          value: "creative",
          emoji: "✍",
        },
        {
          label: "Filminho",
          value: "movie",
          emoji: "📽",
        },
        {
          label: "Clube da Novel",
          value: "novel-club",
          emoji: "📚",
        },
        {
          label: "Leitura Interativa",
          value: "interactive-reading",
          emoji: "📖",
        },
        {
          label: "Desenho da Semana",
          value: "draw-week",
          emoji: "🎨",
        },
      ])
  );

  return await channel.send({ embeds: embed, components: [row] });
};

module.exports = {
  firstRolesMessages,
  secondRolesMessages,
  thirdRolesMessages
};
