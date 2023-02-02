require("dotenv").config();
const { connect, set } = require("mongoose");

const loadMongo = async () => {
  set("strictQuery", false);
  await connect(process.env.MONGO_URI, {
    keepAlive: true,
  }).catch(console.error);
};

module.exports = { loadMongo };
