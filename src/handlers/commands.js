require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");

module.exports = async (client) => {
  let publicCommand = [];
  let privateCommand = [];
  let slashFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".js"));
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
  for (let file of slashFiles) {
    let commandSlash = require(`../commands/${file}`);
    client.commands.set(commandSlash.data.name, commandSlash);
    if (commandSlash.dev == true) {
      privateCommand.push(commandSlash.data.toJSON());
    } else {
      publicCommand.push(commandSlash.data.toJSON());
    }
  }
  try {
    console.log("Loading application commands...");
    if (publicCommand.length) {
      await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
        body: publicCommand,
      });
    }
    if (privateCommand.length) {
      await rest.put(Routes.applicationCommands(process.env.BOT_ID, process.env.GUILD_ID), {
        body: privateCommand,
      });
    }
    console.log("Application commands loaded");
  } catch (error) {
    console.error(error);
  }
};
