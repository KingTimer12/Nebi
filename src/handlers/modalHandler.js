const loadModal = async (client) => {
  const { loadFiles } = require("../utils/fileLoader.js");

  await client.modals.clear();

  const files = await loadFiles("events/modals");
  files.forEach((file) => {
    console.log(file)
    const modal = require(file);

    client.modals.set(modal.customId, modal);
  });

  return console.log(`All loaded modal.`);
};

module.exports = { loadModal };
