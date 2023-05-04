const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getResponse } = require("../managers/formManager");
const form = require("../config/form.json");

let purpleHex = "#D000BA";

const test = () => {
  console.log('ab')
}

function messagesForm(userId) {
  

  return embeds;
}

const allQuestionsMessagesForum = (userId) => {
  let embeds = [];

  const index = 6;
  for (const f of form) {
    if (f.type != "knowledge") continue;
    const answer = getResponse(userId, index);
    embeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(`${index - 5} - ${f.question}`)
        .setDescription(`R: ${answer}`)
    );
    index++;
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
  messagesForm,
  allQuestionsMessagesForum,
  buttonsForum,
  test
};
