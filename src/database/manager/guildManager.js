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

const addOrUpdateForm = async (
  guild,
  { userId, data, oldTag, messagesId = [] }
) => {
  let guildSchema = await getGuild(guild.id);
  if (!guildSchema) {
    guildSchema = await createGuild(guild);
  }

  const value = {
    userId: userId,
    data: data,
    oldTag: oldTag,
    messagesId: messagesId,
  };
  const done = function (error, success) {
    if (error) {
      console.log(error);
    }
  };

  for (const form of guildSchema.forms) {
    if (form.userId == userId) {
      await GuildSchema.updateOne(
        { "forms.userId": userId },
        {
          $set: {
            "forms.$.data": data,
            "forms.$.oldTag": oldTag,
            "forms.$.messagesId": messagesId,
          },
        },
        done
      ).clone();
      return;
    }
  }

  await GuildSchema.findOneAndUpdate(
    { guildId: guild.id },
    { $addToSet: { forms: value } },
    done
  ).clone();
};

const getData = async (guild, userId) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    const array = guildSchema.forms.find((form) => form.userId == userId);
    return array ? array.data : undefined;
  } else await createGuild(guild);
  return undefined;
};

const getOldTag = async (guild, userId) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    const array = guildSchema.forms.find((form) => form.userId == userId);
    return array ? array.oldTag : undefined;
  } else await createGuild(guild);
  return undefined;
};

const getMessagesId = async (guild, userId) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    const array = guildSchema.forms.find((form) => form.userId == userId);
    return array ? array.messagesId : undefined;
  } else await createGuild(guild);
  return undefined;
};

const addOrUpdateDraw = async (guild, { week = 1, data, members = [] }) => {
  let guildSchema = await getGuild(guild.id);
  if (!guildSchema) {
    guildSchema = await createGuild(guild);
  }

  const value = {
    week: week,
    data: data,
    members: members,
  };
  const done = function (error, success) {
    if (error) {
      console.log(error);
    }
  };

  for (const draw of guildSchema.drawEvent) {
    if (draw.week == week) {
      await GuildSchema.updateOne(
        { "drawEvent.week": week },
        {
          $set: {
            "drawEvent.$.data": data,
            "drawEvent.$.members": members,
          },
        },
        done
      ).clone();
      return;
    }
  }

  await GuildSchema.findOneAndUpdate(
    { guildId: guild.id },
    { $addToSet: { drawEvent: value } },
    done
  ).clone();
};

const setDisable = async (guild, week, userId) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    await GuildSchema.updateOne(
      { "drawEvent.week": week, "drawEvent.members.userId": userId },
      {
        $set: {
          "drawEvent.members.$.enable": false,
        },
      },
      done
    ).clone();
    return true;
  } else await createGuild(guild);
  return false;
};

const getEnable = async (guild, week, userId) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    for (const draw of guildSchema.drawEvent) {
      if (draw.week == week) {
        for (const member of draw.members) {
          if (member.userId == userId) {
            return member.enable;
          }
        }
        break;
      }
    }
  } else await createGuild(guild);
  return false;
};

const getInfo = async (guild, week, userId) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    for (const draw of guildSchema.drawEvent) {
      if (draw.week == week) {
        for (const member of draw.members) {
          if (member.userId == userId) {
            return member.draws;
          }
        }
        break;
      }
    }
  } else await createGuild(guild);
  return undefined;
};

const getWeek = async (guild) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    const week = guildSchema.drawEvent.length;
    return week >= 1 ? week : 0;
  } else await createGuild(guild);
  return undefined;
};

const getDataWeek = async (guild, week) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    const array = guildSchema.drawEvent.find((event) => event.week == week);
    return array ? array.data : undefined;
  } else await createGuild(guild);
  return undefined;
};

const getMembers = async (guild, week) => {
  const guildSchema = await getGuild(guild.id);
  if (guildSchema) {
    const array = guildSchema.drawEvent.find((event) => event.week == week);
    return array ? array.members : undefined;
  } else await createGuild(guild);
  return undefined;
};

module.exports = {
  addChannel,
  getChannel,

  addRole,
  getRole,

  addOrUpdateForm,
  getData,
  getOldTag,
  getMessagesId,

  addOrUpdateDraw,
  getWeek,
  getDataWeek,
  getMembers,
  getEnable,
  getInfo,
  setDisable
};
