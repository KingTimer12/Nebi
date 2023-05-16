const {
  getTimestamp,
  getRole,
  getGuild,
  saveMembers,
} = require("../database/manager/guildManager");
const { toMoment } = require("../utils/timerApi");

const checkingMember = async (guild) => {
  const rookieId = await getRole(guild, { roleName: "rookie" });
  if (!rookieId) return;
  for (const member of guild.members.cache.values()) {
    if (!member.roles.cache.has(rookieId)) continue;
    const currentDate = toMoment(Date.now());
    const timestamp = await getTimestamp(guild, member.id);
    if (!timestamp) continue;
    const finalDate = toMoment(timestamp);
    if (currentDate.unix() >= finalDate.unix()) {
      const roleRookie = guild.roles.cache.find((role) => role.id === rookieId);
      await member.roles.remove([roleRookie]).catch(console.error);

      const guildSchema = await getGuild(guild.id);
      if (!guildSchema) continue;
      const members = guildSchema.newMember;
      const index = members.indexOf({ userId: member.id });
      if (index > -1) {
        members.splice(index, 1);
      }
      await saveMembers(guild.id, members);
    }
  }
};

module.exports = { checkingMember };
