const { getChannel } = require("../database/manager/guildManager");
const { mainMessagesForum } = require("../messages/forumAppMessage");
require("dotenv").config();

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
  const forumId = await getChannel(guild, { channelName: "forum" });
  const forumChannel = guild.channels.cache.find((chn) => chn.id === forumId);
  if (forumChannel == undefined) {
    return console.log("Forum Channel is undefined!");
  }

  const user = guild.members.cache
    .map((member) => member.user)
    .find((user) => user.id == userId);

  if (user == undefined) return undefined;

  const tagEmoji = [
    forumChannel.availableTags.find((r) => r.name == "Aberto").id,
  ];

  const responses = getResponses(userId);
  if (responses == undefined || !responses.length) {
    return user.send({ content: "Ocorreu um erro ao enviar as respostas!" });
  }

  const nickname = user.tag.replace("#", "");
  const topicThread = await forumChannel.threads.cache.find(
    (thread) => thread.name == nickname
  );
  if (topicThread != undefined) return;

  if (getResponse(userId, 5) == "Sim") {
    tagEmoji.push(
      forumChannel.availableTags.find((r) => r.name == "Tutorando+").id
    );
  }

  await forumChannel.threads.create({
    name: `${nickname}`,
    message: {
      content: `<@!${userId}>`,
      embeds: mainMessagesForum(userId),
    },
    appliedTags: tagEmoji,
  }).then(async (threadChannel) => {

  });
};

module.exports = { addResponse, clearResponse, getResponse, getResponses };
