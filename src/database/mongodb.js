require("dotenv").config();
const { connect, set } = require("mongoose");

const loadMongo = async () => {
  set("strictQuery", false);
  const dbOptions = {
    useNewUrlParser: true,
    autoIndex: false,
    connectTimeoutMS: 10000,
    family: 4,
    useUnifiedTopology: true,
  };
  await connect(process.env.MONGO_URI, dbOptions).catch(console.error);
};

module.exports = { loadMongo };
