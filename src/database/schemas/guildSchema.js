const { Schema, model } = require("mongoose");

const GuildSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  guildName: String,
  channels: {
    type: Array,
    default: [{ channelName: String, channelId: String }],
  },
  roles: {
    type: Array,
    default: [{ roleName: String, roleId: String }],
  },
  forms: {
    type: Array,
    default: [
      { userId: String, data: String, oldTag: String, messagesId: [String] },
    ],
  },
  themes: {
    type: Array,
    default: [],
  },
});

module.exports = model("Guild", GuildSchema);
