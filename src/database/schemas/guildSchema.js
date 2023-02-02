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
  drawEvent: {
    type: Array,
    default: [
      {
        week: { type: Number, default: 1 },
        data: Number,
        members: [
          {
            userId: String,
            enable: Boolean,
            draws: [
              {
                drawName: String,
                type: String,
                comments: String,
                url: String,
              },
            ],
          },
        ],
      },
    ],
  },
});

module.exports = model("Guild", GuildSchema);
