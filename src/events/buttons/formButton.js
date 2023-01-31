const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojis } = require("../../utils/emotes.json");

let purpleHex = "#D000BA";

async function sendMessage(interaction, question) {
  const msg = await interaction.user.send(question);
  const check = await awaitMessage(msg.channel);
  return check;
}

async function awaitMessage(channel) {
  const filter = (msg) => msg.content != "";
  const sendedMessage = channel
    .awaitMessages({ max: 1, time: 600_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { content: undefined, message: msgFirst };

      const m = msgFirst.content;
      if (m != undefined) response.content = m;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

module.exports = {
  customId: "Form",
  async execute(interaction, client) {
    const { user } = interaction;
    const userId = user.id;

    await interaction.deferUpdate().then(async () => {
      const embed = new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle("Formulário de Ingresso na Tutoria da Novel Brasil")
        .setDescription(
          `**ESTE FORMULÁRIO É DESTINADO SOMENTE PARA PESSOAS QUE DESEJAM SER MATRICULADAS.**
          
          Olá, <@${userId}>
          
          Neste formulário você poderá solicitar sua matrícula na tutoria da Novel Brasil, a maior comunidade voltada para escritores de novel do Brasil!
          
          O formulário ficará disponível em tempo integral, porém sua resposta não garante a sua entrada na tutoria! Há um número limitado de vagas e, caso já tenha sido atingido um limite, você pode acabar entrando na lista de espera até a nova abertura de matrícula — o que ocorre a cada 3 meses — ou vaga de um tutor abrir.
          
          Preencha o formulário **somente** se estiver interessado em entrar na tutoria.
          
          O procedimento seguirá as seguintes normas:

          > É de inteira responsabilidade do tutorando a resposta e checagem de todas as perguntas do formulário;
          > Todos os formulários enviados serão considerados válidos;
          > Somente será aceito pedido de entrada na tutoria enviado por este formulário, não sendo considerada nenhuma outra forma de solicitação;
          > Os pedidos serão analisados pela Coordenação da Novel Brasil;
          > Os pedidos serão respondidos pelo seu pv do Discord por um membro da Coordenação;
          > Se o aluno apresentar dificuldade no preenchimento deste formulário ou necessitar de novas orientações, deverá entrar em contato com um membro da coordenação da Novel Brasil.
          
          O escritor interessado na tutoria deve responder um questionário de 21 perguntas que servirão como guia para o tutor. Não pesquise na internet! Essas perguntas não irão afetar sua Classe **(todos os tutorandos iniciam na Classe F)** e servem apenas para o tutor poder criar um plano de ensino condizente com o seu conhecimento.
          `
        )
        .setFooter({
          text: "Atenciosamente, Coordenação da Novel Brasil",
          iconURL:
            "https://cdn.discordapp.com/icons/726290600332230686/a_14f38daec9fb705696723c1287986453.gif?size=2048",
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("startForm")
          .setLabel("Iniciar teste")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("afterForm")
          .setLabel("Deixar para depois")
          .setStyle(ButtonStyle.Danger)
      );

      interaction.user.send({ embeds: [embed], components: [row] });

      /*const question = [
        "qual a sua idade?(só numero)",
        "ok. Quais são os melhores horários para você ter tutoria?",
        "ok. Como conheceu o servidor?",
        "Posta novel em algum lugra? Se sim, onde?",
        "Questionario:\nQuais obras e/ou autores te inspiraram para começar a escrever ou foram motivo para escrever a seu atual projeto?",
        "O que você escreve e que tipos gêneros pretende escrever?",
        "Você sabe o que é webnovel ou light novel e como escreve um desses dois? Se souber, explique.",
        "Quais formas existem de compor um capítulo? Explique.",
        "Consegue explicar a diferença de um narrador de primeira pessoa e um de terceira pessoa?",
        "Um parágrafo é estruturado como?",
        "Quais as diferenças existem em frase, oração e peíodor?",
        "Que tipo de funções o travessão, itálico e aspas devem exercer no texto?",
        "Quando se deve colocar as palavras em letra maiúscula?",
        "Erra palavras com escrita e/ou som parecidos? (Exemplos simples: acender/ascender,  acento/assento, acidente/incidente, sob/sobre)",
        "O que são substantivos, adjetivos e pronomes?",
        "Reconhece que sua escrita possui vícios de internet?",
        "A vírgula é usada para o que no texto?",
        "Quando deve usar exclamação, interrogação e reticências?",
        "Elipse é o que?",
        "Se souber, como se deve usar o dicendi?",
        "O que faz um diálogo ser bom e útil na história?",
        "Um personagem deve ser criado de que forma?",
        "O que gostaria de passar, no caso, a mensagem, com a sua história para os leitores?",
        "Qual o tipo de público que você quer alcançar com o seu projeto?",
        "Seu objetivo como autor é qual?",
      ];*/

      /*let index = 0;
      while (question[index] != undefined) {
        const message = await sendMessage(interaction, question[index]);
        if (message == undefined) index = -1;
        index++;
      }*/
    });
  },
};
