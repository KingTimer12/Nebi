const { EmbedBuilder } = require("discord.js");
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
      )
  );

  const startIndex = 6;
  for (let i = startIndex; i < questions.length; i++) {
    if (!(i == 7 || i == 8 || i == 25 || i == 26 || i == 27)) continue
    if (i == 27) {
        embeds.push(
            new EmbedBuilder().setColor(purpleHex)
            .setTitle(questions[i])
            .setDescription(`R: ${answer[i-1]}`)
            .setTimestamp()
        )
        continue
    }
    embeds.push(
        new EmbedBuilder().setColor(purpleHex)
        .setTitle(questions[i])
        .setDescription(`R: ${answer[i-1]}`)
    )
  }

  return embeds;
};

module.exports = {mainMessagesForum}
