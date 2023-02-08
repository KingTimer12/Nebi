const { getUser } = require("../manager/userManager");

module.exports = class UserModel {
  constructor(userId, username, level, glows) {
    this.userId = userId;
    this.username = username;
    this.level = level;
    this.glows = glows;
    this.wallpaper = "https://i.imgur.com/H1GXNG4.jpg";
    this.badges = new Map();
  }

  setGlows = (glows) => {
    this.glows = glows;
  };

  addLevel = (level) => {
    this.level+=level;
  };

  removeLevel = (level) => {
    this.level-=level;
  };

  load = async () => {
    const userSchema = await getUser(this.userId);
    if (userSchema) {
      this.userId = userSchema.userId;
      this.username = userSchema.username;
      this.level = userSchema.level;
      this.glows = userSchema.glows;
      this.wallpaper = userSchema.wallpaper;
      this.badges = userSchema.badges;
      return this
    }
    return undefined
  };
};
