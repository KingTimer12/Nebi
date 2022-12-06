require("dotenv").config();
const { listValues } = require("../utils/googleApi.js");
const {
  sendApp,
  getData,
  getMessagesId,
  has,
  getTag,
} = require("../utils/firebaseFormsApi");
const { toCompare } = require("../utils/timerApi.js");
const {
  mainMessagesForum,
  buttonUpPageForum,
  secondMessagesForum,
  lastMessagesForum,
  thirdMessagesForum,
} = require("../messages/forumAppMessage.js");
const { array } = require("./forumManager.js");
let arrayTemporary = [];

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

  let topicThread = forumChannel.threads.cache.find(
    (thread) => thread.name == user.tag.replace("#", "")
  );

  let overwrite = topicThread != undefined || arrayTemporary.includes(user.id);

  let dataOldValue = await getData(user.id);
  if (overwrite == true) {
    if (toCompare(dataOldValue, dataNowValue) == true) {
      overwrite = undefined;
    }
  } else {
    const oldTag = await getTag(user.id);
    if (oldTag != undefined) {
      topicThread = forumChannel.threads.cache.find(
        (thread) => thread.name == oldTag.replace("#", "")
      );
      if (topicThread != undefined) {
        topicThread.delete()
      }
    }

    arrayTemporary.push(user.id);
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
  if (forumChannel == undefined) return;
  if (guild == undefined) return;
  console.log("CHECKING FORMS...");
  const list = await listValues();
  const questions = list[0];

  const tagEmoji = [array().find((r) => r.name == "Aberto").id];

  let answers = await checkForms(guild, list, forumChannel);
  if (answers.length) {
    for (const row of answers) {
      const userId = row.userId;

      if (row.overwrite == undefined) continue;
      const nickname = row.answer[2].replace("#", "");
      if (row.overwrite == true) {
        //overwrite existing thread
        const topicThread = await forumChannel.threads.cache.find(
          (thread) => thread.name == nickname
        );
        if (topicThread == undefined) continue;

        const arrayMsgs = await getMessagesId(userId);

        await topicThread.messages.edit(arrayMsgs.at(0), {
          content: `<@!${userId}>`,
          embeds: mainMessagesForum(userId, row.answer, row.data, questions),
        });
        await topicThread.messages.edit(arrayMsgs.at(1), {
          embeds: secondMessagesForum(row.answer, questions),
        });
        await topicThread.messages.edit(arrayMsgs.at(2), {
          embeds: thirdMessagesForum(row.answer, questions),
        });
        await topicThread.messages.edit(arrayMsgs.at(3), {
          embeds: lastMessagesForum(row.answer, questions),
        });
        await sendApp(userId, row.data, row.answer[2], arrayMsgs);
        continue;
      }

      //create new thread
      if (row.answer[5] == "Sim") {
        tagEmoji.push(array().find((r) => r.name == "Tutorando+").id);
      }
      await forumChannel.threads
        .create({
          name: `${nickname}`,
          message: {
            content: `<@!${userId}>`,
            embeds: mainMessagesForum(userId, row.answer, row.data, questions),
          },
          appliedTags: tagEmoji,
        })
        .then(async (threadChannel) => {
          const msgURL = threadChannel.messages.cache
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
            components: [buttonUpPageForum(`${msgURL.at(0)}`)],
          });

          const msgIds = threadChannel.messages.cache
            .filter((msg) => msg.author.id === process.env.BOT_ID)
            .map((msg) => msg.id);

          await sendApp(userId, row.data, row.answer[2], msgIds);
        });
    }
    answers = [];
    arrayTemporary = [];
  }
};

module.exports = { checking };
