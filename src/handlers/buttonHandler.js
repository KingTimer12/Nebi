const loadButton = async (client) => {
  const { loadFiles } = require("../utils/fileLoader.js");

  await client.buttons.clear();

  const files = await loadFiles("events/buttons");
  files.forEach((file) => {
    console.log(file)
    const button = require(file);

    client.buttons.set(button.customId, button);
  });

  return console.log(`All loaded buttons.`);
};

module.exports = { loadButton };