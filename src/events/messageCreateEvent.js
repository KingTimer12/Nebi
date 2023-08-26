//Vou colocar o desenvolvimento logo na master e criar uma branch só pro rank pq assim n tá dando

/*const {
  getUser,
  addUser,
  hasCooldown,
  addCooldown,
} = require("../database/handler/userHandler");
const { fetchUser, saveUser } = require("../database/manager/userManager");

module.exports = {
  name: "Message Create",
  event: "messageCreate",
  once: false,

  async createEvent(message) {
    if (message.author.bot) return;
    const { user } = message.member;
    const userId = user.id;

    if (!hasCooldown(userId)) {
      addCooldown(userId)
      let userProfile = getUser(userId)
      if (!userProfile) {
        userProfile = addUser(user)
        const userSchema = await fetchUser(userId)
        if (userSchema) {
          await userProfile.load(userSchema);
        }
      }

      const xpRandom = Math.floor(Math.random() * 9) + 1;
      userProfile.addXp(xpRandom)
      userProfile.checkLevel()
    }
  },
};*/
