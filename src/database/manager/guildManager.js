const GuildSchema = require("../schemas/guildSchema");

const getGuild = async (guildId) =>
  await GuildSchema.findOne({ guildId: guildId });

const createGuild = async (guild) => {
  if (guild == undefined) return;
  const guildSchema = new GuildSchema({
    guildId: guild.id,
    guildName: guild.name,
  });
  await guildSchema
    .save()
    .then(() => console.log("Guild information created"))
    .catch(console.error);
  return guildSchema;
};

const addChannel = async (guild, { channelName, channelId }) => {
  let guildSchema = await getGuild(guild.id);
  if (!guildSchema) {
    guildSchema = await createGuild(guild);
  }

  const value = { channelName: channelName, channelId: channelId };
  const done = function (error, success) {
    if (error) {
      console.log(error);
    }
  };

  for (const channel of guildSchema.channels) {
    if (channel.channelName == channelName) {
      await GuildSchema.updateOne(
        { "channels.channelName": channelName },
        { $set: { "channels.$.channelId": channelId } },
        done
      ).clone();
      return;
    }
  }

  await GuildSchema.findOneAndUpdate(
    { guildId: guild.id },
    { $addToSet: { channels: value } },
    done
  ).clone();
};

const addRole = async (guild, { roleName, roleId }) => {
  let guildSchema = await getGuild(guild.id);
  if (!guildSchema) {
    guildSchema = await createGuild(guild);
  }

  const value = { roleName: roleName, roleId: roleId };
  const done = function (error, success) {
    if (error) {
      console.log(error);
    }
  };

  for (const role of guildSchema.roles) {
    if (role.roleName == roleName) {
      await GuildSchema.updateOne(
        { "roles.roleName": roleName },
        { $set: { "roles.$.roleId": roleId } },
        done
      ).clone();
      return;
    }
  }

  await GuildSchema.findOneAndUpdate(
    { guildId: guild.id },
    { $addToSet: { roles: value } },
    done
  ).clone();
};

const getChannel = async (guild, { channelName, channelId }) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    if (channelName) {
      const array = guildSchema.channels.find(
        (channel) => channel.channelName == channelName
      );
      return array ? array.channelId : undefined;
    }
    if (channelId) {
      const array = guildSchema.channels.find(
        (channel) => channel.channelId == channelId
      );
      return array ? array.channelName : undefined;
    }
  } else await createGuild(guild);
  return undefined;
};

const getRole = async (guild, { roleName, roleId }) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    if (roleName) {
      const array = guildSchema.roles.find((role) => role.roleName == roleName);
      return array ? array.roleId : undefined;
    }
    if (roleId) {
      const array = guildSchema.roles.find((role) => role.roleId == roleId);
      return array ? array.roleName : undefined;
    }
  } else await createGuild(guild);
  return undefined;
};

const getThemes = async (guild) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    return guildSchema.themes
  } else await createGuild(guild);
  return undefined;
};

const setThemes = async (guildId, themes = []) => {

  const filter = { guildId: guildId };
  const update = { $set: {themes: themes} };

  const updateOne = await GuildSchema.findOneAndUpdate(
    filter, update, { new: true }
  );
  return updateOne
};

module.exports = {

  getGuild,

  addChannel,
  getChannel,

  addRole,
  getRole,

  getThemes,
  setThemes
};
