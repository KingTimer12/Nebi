const { Schema, model } = require("mongoose");

const DrawSchema = Schema({
  userId: String,
  draw: [
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

module.exports = model("draws", DrawSchema);
