const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  rank: {
    xp: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
    },
    wallpaper: {
      type: String,
      required: true,
      default: "https://i.imgur.com/H1GXNG4.jpg",
    },
  },
  profile: {
    wallpaper: {
      type: String,
      required: true,
      default: "https://i.imgur.com/H1GXNG4.jpg",
    },
    aboutMe: {
      type: String,
      required: true,
      default: "Não há nada aqui.",
    },
    birthday: {
      type: String,
      required: true,
      default: "??/??",
    },
    badges: Map,
    glows: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

module.exports = model("User", UserSchema);
