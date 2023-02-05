const { getUser, addUser } = require("../database/handler/userHandler");
const { hasUser, saveUser } = require("../database/manager/userManager");

module.exports = {
  name: "Message Create",
  event: "messageCreate",
  once: false,

  async createEvent(message) {
    if (message.author.bot) return;
    const { user } = message.member;
    const userId = user.id;

    if (message.channelId == "820690824463515718") {
      let userProfile = getUser(userId);
      if (!userProfile) {
        if (hasUser(userId)) {
          userProfile = addUser(user);
          await userProfile.load();
        } else {
          userProfile = addUser(user);
        }
      }

      //userProfile.addGlow(50)
    }
  },
};
