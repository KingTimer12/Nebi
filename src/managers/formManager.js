const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  getChannel,
} = require("../database/manager/guildManager");

require("dotenv").config();
const form = require("../config/form.json");

const responsesMap = new Map();

const addResponse = (userId, response) => {
  let responses = getResponses(userId);
  if (responses) {
    responses.push(response);
  } else {
    responses = [response];
  }
  responsesMap.set(userId, responses);
};

const clearResponse = (userId) => {
  responsesMap.delete(userId);
};

const removeResponse = (userId, index) => {
  const array = getResponses(userId);
  array.splice(index, 1);
  responsesMap.set(userId, array);
};

const getResponse = (userId, question) => getResponses(userId)[question];

const getResponses = (userId) => responsesMap.get(userId);

const sortAndMapResponses = (userId) => {
  let responses = getResponses(userId);
  responses = responses.sort((a, b) => a.index - b.index);
  responses = responses.map(x => x.response);
  responsesMap.set(userId, responses)
}

const sendForm = async (userId, guild) => {
  const forumId = await getChannel(guild, { channelName: "forum" });
  const forumChannel = guild.channels.cache.find((chn) => chn.id === forumId);
  if (forumChannel == undefined) {
    return console.log("Forum Channel is undefined!");
  }

  const purpleHex = "#D000BA";

  const user = guild.members.cache
    .map((member) => member.user)
    .find((user) => user.id == userId);

  if (user == undefined) return console.log("User is undefined!");

  const tagEmoji = [
    forumChannel.availableTags.find((r) => r.name == "Aberto").id,
  ];

  sortAndMapResponses(userId);

  const responses = getResponses(userId);
  if (responses == undefined || !responses.length) {
    return user.send({ content: "Ocorreu um erro ao enviar as respostas! Id do erro: #9A0Db12" });
  }

  const nickname = user.username;

  if (getResponse(userId, 4) == "Sim") {
    tagEmoji.push(
      forumChannel.availableTags.find((r) => r.name == "Tutorando+").id
    );
  }

  let mainMessagesEmbeds = [];

  mainMessagesEmbeds.push(
    new EmbedBuilder()
      .setColor(purpleHex)
      .setTitle("Dados do Tutorando")
      .setDescription(
        `**User ID**: ${userId}
        **Idade**: ${getResponse(userId, 0)}
        **Melhores horários**: ${getResponse(userId, 1)}
        **Tutorando+**: ${getResponse(userId, 4)}`
      ),
    new EmbedBuilder().setColor(purpleHex).setTitle("Perguntas Essenciais")
  );

  const startIndex = 5;
  for (let i = startIndex; i < form.length; i++) {
    if (!(i == 5 || i == 6 || i == 23 || i == 24 || i == 25)) continue;
    const response = getResponse(userId, i);
    if (response == undefined)
      return user.send({
        content: "Falha ao enviar uma das respostas. Id do erro: #ab94b12",
      });
    mainMessagesEmbeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(form[i-1].question)
        .setDescription(`R: ${response}`)
    );
  }

  await forumChannel.threads
    .create({
      name: `${nickname}`,
      message: {
        content: `<@!${userId}>`,
        embeds: mainMessagesEmbeds,
      },
      appliedTags: tagEmoji,
    })
    .then(async (threadChannel) => {
      const msgURL = threadChannel.messages.cache
        .filter((msg) => msg.author.id === process.env.BOT_ID)
        .map((msg) => msg.url);

      let embeds = [];

      let index = 5;
      for (const f of form) {
        if (f.classification != "knowledge") continue;
        const answer = getResponse(userId, index);
        if (answer == undefined)
          return user.send({
            content: "Falha ao enviar uma das respostas. Id do erro: #0ffDb12",
          });
        embeds.push(
          new EmbedBuilder()
            .setColor(purpleHex)
            .setTitle(`${index - 4} - ${f.question}`)
            .setDescription(`R: ${answer}`)
        );
        index++;
      }

      index = 0;

      for (const questionEmbed of embeds) {
        if (index == 20) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`formAccept`)
              .setEmoji({ id: "1051884168977584139", name: "ready" })
              .setLabel(`Aprovar`)
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setURL(`${msgURL.at(0)}`)
              .setLabel("⬆ Clique para ir ao topo!")
              .setStyle(ButtonStyle.Link)
          );

          await threadChannel
            .send({
              embeds: [questionEmbed],
              components: [row],
            })

            .catch(console.log);
        } else {
          await threadChannel
            .send({ embeds: [questionEmbed] })
            .catch(console.log);
        }
        index++;
      }

      await user.send({
        content:
          "Agora que terminou de responder todas as perguntas, seja paciente e aguarde ser selecionado. Boa sorte!",
      });
    });
};

module.exports = {
  addResponse,
  clearResponse,
  getResponse,
  getResponses,
  sendForm,
};
