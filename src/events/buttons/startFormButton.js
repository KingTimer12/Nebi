const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { emojis } = require("../../utils/emotes.json");

let purpleHex = "#D000BA";

async function sendMessage(interaction, question) {
  const embed = new EmbedBuilder()
    .setColor(purpleHex)
    .setTitle(question)
    .setTimestamp();
  const msg = await interaction.user.send({embeds:[embed]});
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
  customId: "startForm",
  async execute(interaction, client) {

    await interaction.deferUpdate().then(async () => {
      const embed = new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle("Dados do Tutorando")
        .setTimestamp();

      interaction.user.send({ embeds: [embed] });

      const question = [
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
      ];

      let index = 0;
      while (question[index] != undefined) {
        const message = await sendMessage(interaction, question[index]);
        if (message == undefined) index = -1;
        index++;
      }
    });
  },
};
