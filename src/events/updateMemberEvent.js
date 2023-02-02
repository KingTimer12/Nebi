const { getter } = require("../utils/firebase/firebaseGuildApi");
const { updateNicknameRow } = require("../utils/googleApi/rankApi");

module.exports = {
  name: 'Update Member',
  event: 'guildMemberUpdate',
  once: false,
  
  async createEvent(oldMember, newMember) {

    await updateNicknameRow(755009417, oldMember, newMember)

    if (oldMember.pending && !newMember.pending) {
      const {guild, roles} = newMember

      const genericId = await getter(guild.id, "role", "register");
      if (genericId == undefined) return

      let role = guild.roles.cache.find(
        (role) => role.id == genericId
      );
      if (role == undefined) return

      roles.add(role);
    }

    

  },
};
