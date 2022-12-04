const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { transformTimestamp } = require("../utils/timerApi");

let purpleHex = "#D000BA";

const mainMessagesForum = (userId, answer, data, questions) => {
  let embeds = [];

  embeds.push(
    new EmbedBuilder()
      .setColor(purpleHex)
      .setTitle("Dados do Tutorando")
      .setDescription(
        `**Data da Matrícula**: ${data}\n**User ID**: ${userId}\n**Idade**: ${answer[1]}\n**Melhores horários**: ${answer[27]}`
      ),
    new EmbedBuilder().setColor(purpleHex).setTitle("Perguntas Essenciais")
  );

  const startIndex = 6;
  for (let i = startIndex; i < questions.length; i++) {
    if (!(i == 7 || i == 8 || i == 25 || i == 26 || i == 27)) continue;
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(questions[i])
        .setDescription(`R: ${answer[i - 1]}`)
    );
  }

  return embeds;
};

const secondMessagesForum = (answer, questions) => {
  let embeds = [];

  embeds.push(
    new EmbedBuilder().setColor(purpleHex).setTitle("Todas as perguntas")
  );

  const startIndex = 7;
  for (let i = startIndex; i < questions.length; i++) {
    if (i == 15) break
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(questions[i])
        .setDescription(`R: ${answer[i - 1]}`)
    );
  }

  return embeds;
};

const thirdMessagesForum = (answer, questions) => {
  let embeds = [];

  const startIndex = 15;
  for (let i = startIndex; i < questions.length; i++) {
    if (i == 22) break
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(questions[i])
        .setDescription(`R: ${answer[i - 1]}`)
    );
  }

  return embeds;
};

const lastMessagesForum = (answer, questions) => {
  let embeds = [];

  const startIndex = 22;
  for (let i = startIndex; i < questions.length; i++) {
    if (i == 28) continue
    if (i == 27) {
      embeds.push(
        new EmbedBuilder()
          .setColor(purpleHex)
          .setTitle(questions[i])
          .setDescription(`R: ${answer[i - 1]}`)
          .setTimestamp()
      );
      continue;
    }
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(questions[i])
        .setDescription(`R: ${answer[i - 1]}`)
    );
  }

  return embeds;
};

const buttonUpPageForum = (url) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL(url)
      .setLabel("⬆ Clique para ir ao topo!")
      .setStyle(ButtonStyle.Link)
  );
  return row
};

module.exports = { mainMessagesForum, secondMessagesForum, thirdMessagesForum, lastMessagesForum, buttonUpPageForum };
