const { getUser, addUser, hasCooldown, addCooldown } = require("../database/handler/userHandler");
const { hasUser, saveUser } = require("../database/manager/userManager");

module.exports = {
  name: "Message Create",
  event: "messageCreate",
  once: false,

  async createEvent(message) {
    if (message.author.bot) return;
    const { user } = message.member;
    const userId = user.id;

    /*if (!hasCooldown(userId)) {
      console.log('a')
      addCooldown(userId)

      let userProfile = getUser(userId);
      if (hasUser(userId)) {
        userProfile = addUser(user);
        await userProfile.load();
      } else {
        userProfile = addUser(user);
      }

      const nextLevel = userProfile.level + 1;
      const glowRequired = nextLevel * nextLevel * 100;
      const glowsRandom = Math.floor(Math.random() * 9) + 1;
      let glows = (userProfile.glows += glowsRandom);
      if (glows >= glowRequired) {
        userProfile.addLevel(1);
      }
      userProfile.setGlows(glows);
    }*/
  },
};
