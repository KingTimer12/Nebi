const { Schema, model } = require("mongoose");

const DrawSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  draws: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      description: String,
    },
  ],
});

module.exports = model("Draw", DrawSchema);
