const { Configuration, OpenAIApi } = require("openai");
const { ask } = require("../utils/aiApi");
const { hasCooldown, addCooldown } = require("../database/handler/userHandler");
const { getXp, update_profile, readjustLevel, create_profile, getLastMessage, getRanking, update_badges } = require("../database/manager/userManager");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  name: "Message Create",
  event: "messageCreate",
  once: false,

  async createEvent(message) {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    const { user } = message.member;
    const username = user.username
    const userId = user.id;
    await create_profile(userId, username)
    await update_badges(message.member)

    if (!hasCooldown(userId)) {
      addCooldown(userId, 5 * 1000);

      const xpRandom = Math.floor(Math.random() * 9) + 1;
      const actualXp = await getXp(userId)
      const xp = actualXp + xpRandom;
      const level = await readjustLevel(userId, xp)

      const checkDate = new Date();
      checkDate.setMonth(checkDate.getMonth() + 4);

      await update_profile(userId, {
        xp: xp,
        level: level,
        last_message: checkDate
      })
    }
  },
};
