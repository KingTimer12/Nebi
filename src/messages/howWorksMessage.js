const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getter } = require("../utils/firebase/firebaseGuildApi");

const events =
  "https://cdn.discordapp.com/attachments/905904400902537288/1029059110177624064/eventos_1.png";

const announcement =
  "https://cdn.discordapp.com/attachments/905904400902537288/1029059451380039740/anuncios_1.png";

const rule =
  "https://cdn.discordapp.com/attachments/905904400902537288/1029059566425612288/regras_1.png";

const redHex = "#e91a25";

const firstMessages = async (channel) => {
  const embed1 = new EmbedBuilder()
    .setColor("Aqua")
    .setDescription(
      "A Novel Brasil realiza eventos periodicamente. O membro, caso deseje participar, deve prestar atenção no chat #👑┃eventos, onde são feitos os anúncios, e seguir as regras do evento que deseja participar."
    );
  const embed2 = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("Eventos fixos")
    .setDescription(
      "Escrita Criativa: <#1009230852946931712>\n\n" +
        "Explicação: Evento diário. O membro deve fazer um texto todo dia usando como referência as imagens e textos postados pelos membros da staff.\n\n" +
        "Premiação: Nitro ao fim de toda season (Mês)"
    );
  const embed3 = new EmbedBuilder()
    .setColor("#e600e6")
    .setTitle("Hall da Fama")
    .setDescription(
      "Os vencedores dos eventos aparecem em <#902684183518937138> e estão marcados para sempre na história da Novel Brasil!"
    );

  return await channel.send({ files: [events], embeds: [embed1, embed2, embed3] });
};

const secondsMessages = async (channel) => {
  const embed = new EmbedBuilder()
    .setColor(redHex)
    .setDescription(
      "Caso deseje ficar sempre informado sobre o que está acontecendo na Novel Brasil, sigam e fiquem atentos ao canal <#823997834973806653>"
    );

  return await channel.send({ files: [announcement], embeds: [embed] });
};

const thirdMessages = async (channel) => {

  const divulgationId = await getter(channel.guildId, 'channel', 'divulgation-works')
  const ranksId = await getter(channel.guildId, 'channel', 'rank')

  const embed1 = new EmbedBuilder()
    .setColor(redHex)
    .setTitle("Regras")
    .setDescription(
      "Este conjunto de regras define a relação de direitos e deveres dos membros deste servidor. Sendo passível de ban apenas aqueles que infrinjam as regras do Discord ou das regras citadas aqui."
    );
  //new Promise((resolve) => setTimeout(resolve, 200));
  const embed2 = new EmbedBuilder()
    .setColor("#ff1aff")
    .setTitle("Convivência")
    .setDescription(
      "**1.** Este servidor não restringe a entrada de pessoas de qualquer idade (respeitando as regras do Discord), gênero ou orientação sexual.\n\n" +
        "**2.** Para garantir o cumprimento das regras deste servidor, os membros da staff podem aplicar as seguintes punições:\n\n" +
        "  a) 🟡 Punição leve: aviso ou mute de até 2 horas;\n\n" +
        "  b) 🟠 Punição mediana: de 1 a 7 dias de mute; e\n\n" +
        "  c) 🔴 Punição pesada: banimento permanente.\n\n" +
        "**2.1.** Consideramos os seguintes comportamentos, passíveis de punição leve:\n\n" +
        "  a) Pequenas discussões destrutivas;\n\n" +
        "  b) Mensagens em canais errados (primeiro será dado um aviso e, caso continue acontecendo, a punição será aplicada); e\n\n" +
        "  c) Mensagens inapropriadas neste servidor (a punição irá aumentar dependendo do teor da mensagem); \n\n" +
        "  d) Induzir membros ao erro (chat ou pv);\n\n" +
        "**2.2.** Consideramos os seguintes comportamentos, passíveis de punição mediana:\n\n" +
        "  a) Discussões intensas, onde poderiam ocorrer ofensas diretas;\n\n" +
        "  b) Revelar informações pessoais de algum membro sem sua permissão e desrespeitar sua privacidade; e\n\n" +
        "  c) Envio de conteúdo ou mensagem inapropriada e ofensiva.\n\n" +
        "**2.3.** Consideramos os seguintes comportamentos, passíveis de punição pesada:\n\n" +
        "  a) Raid;\n\n  b) Flood;\n\n  c) Plágio;\n\n  d) Bullying ou assedio;\n\n  e) Infrações recorrentes;\n\n" +
        "  f) Enviar mensagem no pv de outros membros (sem o consentimento dos mesmos)\n\n" +
        "  g) Envio de conteúdo +18 (não solicitado e inadequado);\n\n" +
        "  h) Spam (incluindo convites indesejados no privado dos membros);\n\n" +
        "  i) Comportamento destrutivo ou criminoso aqui ou no privado dos membros;\n\n" +
        "  j) Tentar se aproveitar de falhas de segurança do servidor para qualquer fim; e\n\n" +
        "  k) Induzir membros ao erro, sendo no chat ou no pv, causando danos materiais, morais, de saúde ou qualquer espécie de dano considerável.\n\n" +
        "**2.4.** Os membros da staff podem interpretar, à sua maneira, infrações e seu grau.\n\n" +
        "**3.** Casos omissos são de livre interpretação dos membros da staff e serão tratados conforme regra 2, inclusive o desrespeito às regras aqui estabelecidas."
    );
  //new Promise((resolve) => setTimeout(resolve, 200));
  const embed3 = new EmbedBuilder()
    .setColor("#ff1aff")
    .setDescription(
      "**4.** Não tragam problemas pessoais para o server. Essa é uma regra complicada, mas precisa com o crescimento do server.\n\n" +
        "Desabafar ou falar de problemas pessoais com seus amigos é algo necessário e que pode te ajudar, porém trazer esses assuntos pro server podem desencadear problemas (para quem está desabafando e para os outros membros).\n\n" +
        "Além de colocar pessoas que não estão ligadas ao assunto em uma situação desconfortável, a pessoa que está fragilizada pode acabar encontrando alguém mal intencionado que vai causar ainda mais dano (podemos punir essa pessoa mal intencionada, mas o dano já terá sido causado)."
    );
  const embed4 = new EmbedBuilder()
    .setColor("#6C0BA9")
    .setTitle("Chats")
    .setDescription(
      "**5.** Neste servidor pode ser conversado sobre qualquer assunto, desde que se mantenha dentro das regras e no chat adequado.\n\n" +
        "**6.** Na inexistência de um chat próprio para o assunto, o membro poderá solicitar a criação ao membro da staff, que o fará se, e somente se, for considerado pertinente para o servidor."
    );
  const embed5 = new EmbedBuilder()
    .setColor("#1ae9de")
    .setTitle("Divulgação")
    .setDescription(
      `**7.** A divulgação de obra (autoral) pode ser feita no canal <#${divulgationId}> (nesse canal pode ser postado links de qualquer site, deixando um aviso em caso de histórias +18);\n\n` +
        "**7.1.** Não faça flood no canal de divulgação, poste apenas quando sair capítulo novo (e quando chegar no server pela primeira vez);\n\n" +
        "**7.2.** Não fique postando o link de uma obra (sendo sua ou não) em outros canais;\n\n" +
        `**7.3.** Links de sites não parceiros são proibidos fora do canal de divulgação (<#${divulgationId}>);\n\n` +
        "**7.4.** Traduções e outras mídias seguem as mesmas regras;"
    );
  const embed6 = new EmbedBuilder()
    .setColor("#1ae977")
    .setTitle("Críticas")
    .setDescription(
      "**8.** Este é um servidor voltado aos estudos da escrita, principalmente na forma de novels, sendo lightnovel ou webnovel, portanto o membro que se sentir confortável poderá solicitar opiniões sobre sua escrita e solicitar esclarecimento de dúvidas para qualquer membro do server e da staff.\n\n" +
        "**9.** Não são permitidas críticas e conselhos que não tenham sido solicitadas.\n\n" +
        "**10.** Críticas devem ser dadas somente pelo membro em que o autor autorizou ou solicitou a crítica direta.\n\n" +
        "**11.** Sendo a crítica autorizada, este servidor não define o nível e nem assunto, sendo de responsabilidade do crítico estabelecer junto ao autor.\n\n"
    );
  const embed7 = new EmbedBuilder()
    .setColor("#24e91a")
    .setTitle("Tutoria")
    .setDescription(
      `**12.** Tutor e tutorando devem seguir as regras e condutas definidas no canal (<#${ranksId}>).\n\n` +
      "**13.** Devido a problemas antecedentes, decidimos estipular a idade mínima de 14 anos para que possam se matricular na tutoria (o tutor poderá retirar o membro mais novo caso seja descoberto);"
    );
  //new Promise((resolve) => setTimeout(resolve, 200));
  return await channel.send({
    files: [rule],
    embeds: [embed1, embed2, embed3, embed4, embed5, embed6, embed7],
  });
};

const fourthMessages = async (channel) => {

  const rolesChannelId = await getter(channel.guildId, 'channel', 'roles')

  const embed = new EmbedBuilder()
    .setColor(redHex)
    .setTitle('RUMO À LIBERDADE!')
    .setTimestamp()
    .setDescription(
      "Para liberar a 2ª fase do registro, clique no **BOTÃO** __abaixo desta mensagem__. " +
      `Caso não apareça o <#${rolesChannelId}> após clicar, peça ajuda para algum **COORDENADOR**.`
    ).setFooter({ text: '© Novel Brasil' });

    const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('next')
					.setLabel('PRÓXIMO PASSO')
					.setStyle(ButtonStyle.Secondary),
			);

  return await channel.send({ embeds: [embed], components: [row] });
};

module.exports = {
  firstMessages,
  secondsMessages,
  thirdMessages,
  fourthMessages,
};
