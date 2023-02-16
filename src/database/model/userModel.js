const { getUser } = require("../manager/userManager");
const userSchema = require("../schemas/userSchema");

module.exports = class UserModel {
  constructor(userId, username, level, glows) {
    this.userId = userId;
    this.username = username;
    this.level = level;
    this.glows = glows;
    this.wallpaper = "https://i.imgur.com/H1GXNG4.jpg";
    this.badges = new Map();
    this.position = 1;
  }

  setGlows = (glows) => {
    this.glows = glows;
  };

  addLevel = (level) => {
    this.level += level;
  };

  removeLevel = (level) => {
    this.level -= level;
    if (this.level < 1) {
      this.level = 1;
    }
  };

  loadPosition = async () => {
    const leaderboard = await userSchema
      .find({})
      .sort([["glows", "descending"]])
      .exec();
    this.position = leaderboard.findIndex((i) => i.userId === this.userId) + 1;
  };

  readjustLevel = () => {
    while (true) {
      const currentLevel = this.level;
      const nextLevel = currentLevel + 1;
      if (this.glows >= nextLevel * nextLevel * 100) {
        this.addLevel(1);
      } else {
        if (this.glows >= currentLevel * currentLevel * 100) break;
        if (currentLevel == 1) break;
        this.removeLevel(1);
      }
    }
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
      return this;
    }
    return undefined;
  };

  calculateGlows = (level) => {
    return level * level * 100;
  };
};
