const { getRole } = require("../database/manager/guildManager");
const { updateNicknameRow } = require("../utils/googleApi/rankApi");

module.exports = {
  name: 'Update Member',
  event: 'guildMemberUpdate',
  once: false,
  
  async createEvent(oldMember, newMember) {

    await updateNicknameRow(755009417, oldMember, newMember)

    if (oldMember.pending && !newMember.pending) {
      const {guild, roles} = newMember

      const registerId = await getRole(guild, {roleName: 'register'})
      if (registerId == undefined) return
      let role = guild.roles.cache.find(
        (role) => role.id == registerId
      );
      if (role == undefined) return

      await roles.add(role).catch(console.error);
    }

    

  },
};
