const UserSchema = require("../schemas/userSchema");

const getUser = async (userId) => await UserSchema.findOne({ userId: userId });

const createUser = async (userModel) => {
  if (userModel == undefined) return;
  const userSchema = new UserSchema({
    userId: userModel.userId,
    username: userModel.username,
    level: userModel.level,
    glows: userModel.glows,
    wallpaper: userModel.wallpaper,
    badges: userModel.badges,
  });
  await userSchema.save();
};

const saveUser = async (userModel) => {
  const userProfile = await getUser(userModel.userId);
  if (!userProfile) return createUser(userModel);
  const done = function (error, success) {
    if (error) {
      console.log(error);
    }
  };
  await UserSchema.updateOne(
    { userId: userModel.userId },
    {
      $set: {
        username: userModel.username,
        level: userModel.level,
        glows: userModel.glows,
        wallpaper: userModel.wallpaper,
        badges: userModel.badges,
      },
    },
    done
  ).clone();
};

const hasUser = async (userId) => {
  return (await getUser(userId)) != undefined;
};

module.exports = {
  createUser,
  saveUser,
  hasUser,
  getUser,
};
