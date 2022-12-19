const loadSelect = async (client) => {
  const { loadFiles } = require("../utils/fileLoader.js");

  await client.selects.clear();

  const files = await loadFiles("events/selects");
  files.forEach((file) => {
    console.log(file);
    const select = require(file);

    client.selects.set(select.customId, select);
  });

  return console.log(`All loaded selects.`);
};

module.exports = { loadSelect };
