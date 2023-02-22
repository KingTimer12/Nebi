const UserModel = require("../model/userModel");
const UserSchema = require("../schemas/userSchema");

const fetchUser = async (userId) => await UserSchema.findOne({ userId: userId });

const createUser = async (userModel) => {
  if (userModel == undefined) return;
  const {userId, username, profileData, rankData} = userModel
  const userSchema = new UserSchema({
    userId: userId,
    username: username,
    profile: {
      aboutMe: profileData.aboutMe,
      birthday: profileData.birthday,
      glows: profileData.glows,
      wallpaper: profileData.wallpaper,
      badges: profileData.badges
    },
    rank: {
      level: rankData.level,
      wallpaper: rankData.wallpaper,
      xp: rankData.xp
    }
  });
  await userSchema.save();
};

const saveUser = async (userModel = new UserModel()) => {
  const userProfile = await fetchUser(userModel.userId);
  if (!userProfile) return await createUser(userModel);

  const {userId, username, profileData, rankData} = userModel

  const done = function (error, success) {
    if (error) {
      console.log(error);
    }
  };
  await UserSchema.updateOne(
    { userId: userId },
    {
      $set: {
        username: username,
        profile: {
          aboutMe: profileData.aboutMe,
          birthday: profileData.birthday,
          glows: profileData.glows,
          wallpaper: profileData.wallpaper,
          badges: profileData.badges
        },
        rank: {
          level: rankData.level,
          wallpaper: rankData.wallpaper,
          xp: rankData.xp
        }
      },
    },
    done
  ).clone();
};

module.exports = {
  createUser,
  saveUser,
  fetchUser,
};
