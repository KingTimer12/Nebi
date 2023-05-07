const { Configuration, OpenAIApi } = require("openai");
const {
  getUser,
  addUser,
  hasCooldown,
  addCooldown,
} = require("../database/handler/userHandler");
const { hasUser, saveUser } = require("../database/manager/userManager");
const { ask } = require("../utils/aiApi");

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

    if (
      message.channel.id === "1046080830075834392" &&
      message.content.startsWith("!")
    ) {

      await message.channel.sendTyping()

      const prompt = message.content.substring(1);
      const answer = await ask(prompt);
      message.reply(answer)
    }

    /*const { user } = message.member;
    const userId = user.id;
    
    if (!hasCooldown(userId)) {
      addCooldown(userId);

      let userProfile = getUser(userId);
      if (!userProfile) {
        if (hasUser(userId)) {
          userProfile = addUser(user);
          await userProfile.load();
        } else {
          userProfile = addUser(user);
        }
      }

      const glowsRandom = Math.floor(Math.random() * 9) + 1;
      let glows = userProfile.glows + glowsRandom;
      userProfile.setGlows(glows);
      userProfile.readjustLevel();
    }*/
  },
};
