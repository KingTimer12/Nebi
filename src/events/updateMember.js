const { getter } = require("../utils/firebase/firebaseGuildApi");

module.exports = {
  name: 'Update Member',
  event: 'guildMemberUpdate',
  once: false,
  
  async createEvent(oldMember, newMember) {
    if (oldMember.pending && !newMember.pending) {
      const genericId = await getter(guild.id, "role", "register");
      if (genericId == undefined) return
      var role = newMember.guild.roles.cache.find(
        (role) => role.id == genericId
      );
      if (role == undefined) return
      newMember.roles.add(role);
    }
  },
};
