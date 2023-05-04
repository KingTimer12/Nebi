const { EmbedBuilder } = require("discord.js");
const {
  getChannel,
  addOrUpdateForm,
} = require("../database/manager/guildManager");
const {
  allQuestionsMessagesForum,
  buttonsForum,
  messagesForm,
  test,
} = require("../messages/forumAppMessage");
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

const getResponse = (userId, question) => getResponses(userId)[question - 1];

const getResponses = (userId) => responsesMap.get(userId);

const sendForm = async (userId, guild) => {
  test()
  const forumId = await getChannel(guild, { channelName: "forum" });
  const forumChannel = guild.channels.cache.find((chn) => chn.id === forumId);
  if (forumChannel == undefined) {
    return console.log("Forum Channel is undefined!");
  }

  const user = guild.members.cache
    .map((member) => member.user)
    .find((user) => user.id == userId);

  if (user == undefined) return console.log('User is undefined!');

  const tagEmoji = [
    forumChannel.availableTags.find((r) => r.name == "Aberto").id,
  ];

  const responses = getResponses(userId);
  if (responses == undefined || !responses.length) {
    return user.send({ content: "Ocorreu um erro ao enviar as respostas!" });
  }

  const nickname = user.tag.replace("#", "");

  if (getResponse(userId, 5) == "Sim") {
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
        `**User ID**: ${userId}\n**Idade**: ${getResponse(
          userId,
          1
        )}\n**Melhores horários**: ${getResponse(userId, 2)}`
      ),
    new EmbedBuilder().setColor(purpleHex).setTitle("Perguntas Essenciais")
  );

  const startIndex = 4;
  for (let i = startIndex; i < form.length; i++) {
    if (!(i == 4 || i == 5 || i == 22 || i == 23 || i == 24)) continue;
    const response = getResponse(userId, i + 1);
    mainMessagesEmbeds.push(
      new EmbedBuilder()
        .setColor(purpleHex)
        .setTitle(form[i].question)
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

      const index = 0;
      for (const questionEmbed of allQuestionsMessagesForum(userId)) {
        if (index == 21) {
          await threadChannel
            .send({
              embeds: [questionEmbed],
              components: [buttonsForum(`${msgURL.at(0)}`)],
            })

            .catch(console.log);
        } else {
          await threadChannel
            .send({ embeds: [questionEmbed] })
            .catch(console.log);
        }
        index++;
      }

      const msgIds = threadChannel.messages.cache
        .filter((msg) => msg.author.id === process.env.BOT_ID)
        .map((msg) => msg.id);

      await addOrUpdateForm(guild, {
        userId: userId,
        oldTag: user.tag,
        messagesId: msgIds,
      });

      await user.send({
        content:
          "Agora que terminou de responder todas as perguntas, seja paciente e aguarde ser selecionado. Boa sorte!",
      });
    });
};

module.exports = { addResponse, clearResponse, getResponse, getResponses, sendForm };
