const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { transformTimestamp } = require("../utils/timerApi");
const { getResponse } = require("../managers/formManager");
const form = require("../config/form.json");

let purpleHex = "#D000BA";

const mainMessagesForum = (userId) => {
  let embeds = [];

  embeds.push(
    new EmbedBuilder()
      .setColor(purpleHex)
      .setTitle("Dados do Tutorando")
      .setDescription(
        `**User ID**: ${userId}\n**Idade**: ${getResponse(userId, 1)}\n**Melhores horários**: ${getResponse(userId, 2)}`
      ),
    new EmbedBuilder().setColor(purpleHex).setTitle("Perguntas Essenciais")
  );

  const startIndex = 4;
  for (let i = startIndex; i < form.length; i++) {
    if (!(i == 4 || i == 5 || i == 22 || i == 23 || i == 24)) continue;
    const response = getResponse(userId, i+1)
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(form[i].question)
        .setDescription(`R: ${response}`)
    );
  }

  return embeds;
};

const allQuestionsMessagesForum = (userId) => {
  let embeds = [];

  const index = 6
  for (const f of form) {
    if (f.type != "knowledge") continue
    const answer = getResponse(userId, index)
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(`${index-5} - ${f.question}`)
        .setDescription(`R: ${answer}`)
    );
    index++
  }

  return embeds;
};

const lastMessagesForum = (answer, questions) => {
  let embeds = [];

  const startIndex = 22;
  for (let i = startIndex; i < questions.length; i++) {
    if (i == 28) continue;
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

const buttonsForum = (url) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`formAccept`)
      .setEmoji({ id: "1051884168977584139", name: "ready" })
      .setLabel(`Aprovar`)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setURL(url)
      .setLabel("⬆ Clique para ir ao topo!")
      .setStyle(ButtonStyle.Link)
  );
  return row;
};

module.exports = {
  mainMessagesForum,
  secondMessagesForum,
  thirdMessagesForum,
  lastMessagesForum,
  buttonsForum,
};
