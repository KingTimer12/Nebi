require("dotenv").config();
const { listValues } = require("../utils/googleApi.js");
const { hasSent, sendApp, getData } = require("../utils/firebaseFormsApi");
const { toCompare } = require("../utils/timerApi.js");
const { getter } = require("../utils/firebaseGuildApi.js");
const {
  mainMessagesForum,
  buttonUpPageForum,
  secondMessagesForum,
  lastMessagesForum,
  thirdMessagesForum,
} = require("../messages/forumAppMessage.js");
const { array } = require("./forumManager.js");
const { thirdMessages } = require("../messages/howWorksMessage.js");

const createFormat = async (client, row) => {
  const dataNowValue = row[0];
  if (toCompare(dataNowValue, "01/12/2022 00:00:00") != true) {
    return undefined;
  }
  const answers = [];
  let answer = [];
  for (let i = 1; i < row.length; i++) {
    answer.push(row[i]);
  }
  const user = client.users.cache.find((user) => user.tag === row[3]);
  if (user == undefined) return undefined;
  let stats = await hasSent(user.id);
  if (stats == "true") {
    const dataOldValue = await getData(user.id);
    if (toCompare(dataOldValue, dataNowValue) == true) {
      stats = undefined;
    }
  }

  answers.push({
    userId: user.id,
    data: row[0],
    overwrite: stats,
    answer: answer,
  });
  return answers;
};

const checkForms = async (client, list) => {
  const answers = [];

  if (list.length) {
    list.shift();
    for (const row of list) {
      if (row[1] == undefined || row[1] == null) continue;
      const formatArray = await createFormat(client, row);
      if (formatArray == undefined) continue;
      formatArray.forEach((answer) =>
        answers.push({
          userId: answer.userId,
          data: answer.data,
          overwrite: answer.overwrite,
          answer: answer.answer,
        })
      );
    }
  }

  return answers;
};

const fetchMember = async (client, guildId, userId) => {
  const guild = await client.guilds.cache.find((guild) => guild.id === guildId);
  const member = await guild.members.cache.find(
    (member) => member.user.id === userId
  );
  const result = [];
  if (member == undefined) return result;
  result.push({
    id: member.user.id,
    tag: `${member.user.username}#${member.user.discriminator}`,
  });
  return result;
};

const checking = async (client, forumChannel, guildId) => {
  console.log("CHECKING FORMS...");
  const list = await listValues();
  const questions = list[0];

  const tagEmoji = [array().find((r) => r.name == "Aberto").id];

  let answers = await checkForms(client, list);
  if (answers.length) {
    for (const row of answers) {
      const userId = row.userId;
      const members = await fetchMember(client, guildId, userId);
      if (!members.length) continue;

      //new Promise((resolve) => setTimeout(resolve, 150));
      if (row.overwrite == undefined) continue;
      if (row.overwrite == "true") {
        //overwrite existing thread
        const topicThread = forumChannel.threads.cache.find(
          (thread) => thread.name == row.answer[2].replace("#", "")
        );
        if (topicThread == undefined) {
          continue;
        }
        const msgIds = threadChannel.messages.cache
          .filter((msg) => msg.author.id === process.env.BOT_ID)
          .map((msg) => msg.id);
        //const messageId = await getMessageId(userId);

        /*await topicThread.messages
          .edit(messageId, message)
          .then(
            async (msg) =>
              await sendApp(userId, messageId, row.data, row.answer)
          );*/
        continue;
      }

      //create new thread
      if (row.answer[5] == "Sim") {
        tagEmoji.push(array().find((r) => r.name == "Tutorando+").id);
      }
      await forumChannel.threads
        .create({
          name: `${row.answer[2]}`,
          message: {
            content: `<@!${userId}>`,
            embeds: mainMessagesForum(userId, row.answer, row.data, questions),
          },
          appliedTags: tagEmoji,
        })
        .then(async (threadChannel) => {
          const msgIds = threadChannel.messages.cache
            .filter((msg) => msg.author.id === process.env.BOT_ID)
            .map((msg) => msg.url);

          await threadChannel.send({
            embeds: secondMessagesForum(row.answer, questions),
          });

          await threadChannel.send({
            embeds: thirdMessagesForum(row.answer, questions),
          });

          await threadChannel.send({
            embeds: lastMessagesForum(row.answer, questions),
            components: [buttonUpPageForum(`${msgIds.at(0)}`)],
          });

          await sendApp(userId, row.data, row.answer);
        });
    }
    answers = [];
  }
};

module.exports = { checking };
