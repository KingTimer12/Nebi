require("dotenv").config();
const { listValues } = require("../utils/googleApi.js");
const { sendApp, getData } = require("../utils/firebaseFormsApi");
const { toCompare } = require("../utils/timerApi.js");
const {
  mainMessagesForum,
  buttonUpPageForum,
  secondMessagesForum,
  lastMessagesForum,
  thirdMessagesForum,
} = require("../messages/forumAppMessage.js");
const { array } = require("./forumManager.js");

const createFormat = async (guild, row, forumChannel) => {
  const dataNowValue = row[0];
  if (toCompare(dataNowValue, "01/12/2022 00:00:00") != true) {
    return undefined;
  }

  const user = guild.members.cache
    .map((member) => member.user)
    .find((user) => user.tag === row[3]);

  if (user == undefined) return undefined;

  const answers = [];
  let answer = [];

  for (let i = 1; i < row.length; i++) {
    answer.push(row[i]);
  }

  const topicThread = forumChannel.threads.cache.find(
    (thread) => thread.name == user.tag.replace("#", "")
  );

  let overwrite = topicThread != undefined;

  if (overwrite == true) {
    const dataOldValue = await getData(user.id);
    if (toCompare(dataOldValue, dataNowValue) == true) {
      overwrite = undefined;
    }
  }

  answers.push({
    userId: user.id,
    data: row[0],
    overwrite: overwrite,
    answer: answer,
  });
  return answers;
};

const checkForms = async (guild, list, forumChannel) => {
  const answers = [];

  if (list.length) {
    list.shift();
    for (const row of list) {
      if (row[1] == undefined || row[1] == null) continue;
      const formatArray = await createFormat(guild, row, forumChannel);
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

const checking = async (guild, forumChannel) => {
  console.log("CHECKING FORMS...");
  const list = await listValues();
  const questions = list[0];

  const tagEmoji = [array().find((r) => r.name == "Aberto").id];

  let answers = await checkForms(guild, list, forumChannel);
  if (answers.length) {
    for (const row of answers) {
      const userId = row.userId;
      
      if (row.overwrite == undefined) continue;

      if (row.overwrite == true) {
        //overwrite existing thread
        const topicThread = forumChannel.threads.cache.find(
          (thread) => thread.name == row.answer[2].replace("#", "")
        );
        if (topicThread == undefined) continue;
        const msgIds = threadChannel.messages.cache
          .filter((msg) => msg.author.id === process.env.BOT_ID)
          .map((msg) => msg.id);
        
          await topicThread.messages.edit(msgIds.at(0), {
            content: `<@!${userId}>`,
            embeds: mainMessagesForum(userId, row.answer, row.data, questions),
          })
          await topicThread.messages.edit(msgIds.at(1), {
            embeds: secondMessagesForum(row.answer, questions),
          })
          await topicThread.messages.edit(msgIds.at(2), {
            embeds: thirdMessagesForum(row.answer, questions),
          })
          await topicThread.messages.edit(msgIds.at(4), {
            embeds: lastMessagesForum(row.answer, questions)
          })
          await sendApp(userId, row.data)
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

          await sendApp(userId, row.data);
        });
    }
    answers = [];
  }
};

module.exports = { checking };
