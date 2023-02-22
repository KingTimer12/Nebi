const { fetchUser } = require("../manager/userManager");
const userSchema = require("../schemas/userSchema");
const ProfileData = require("./data/profileData");
const RankData = require("./data/rankData");

module.exports = class UserModel {
  constructor(userId = "", username = "") {
    this.userId = userId;
    this.username = username;
    this.profileData = new ProfileData();
    this.rankData = new RankData();
    this.position = 1;
  }

  setGlows = (glows) => {
    this.profileData.setGlows(glows);
  };

  addLevel = () => {
    this.rankData.addLevel();
  };

  addXp = (xp) => {
    this.rankData.addXp(xp);
  };

  loadPosition = async () => {
    const leaderboard = await userSchema
      .find({})
      .sort([["rank.xp", "descending"]])
      .exec();
    this.position = leaderboard.findIndex((i) => i.userId === this.userId) + 1;
  };

  nextLevel = () => {
    return (this.rankData.level + 1) * (this.rankData.level + 1) * 100;
  };

  checkLevel = () => {
    if (this.rankData.xp >= this.nextLevel()) this.addLevel();
  };

  load = async (userSchema) => {
    if (userSchema) {
      const { profile, rank } = userSchema;
      this.profileData = new ProfileData(
        profile.aboutMe,
        profile.birthday,
        profile.glows,
        profile.badges,
        profile.wallpaper
      );
      this.rankData = new RankData(rank.xp, rank.level, rank.wallpaper);
      this.position = await this.loadPosition();
      return this;
    }
    return undefined;
  };
};
