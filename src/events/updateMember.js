module.exports = {
  name: 'Update Member',
  event: 'guildMemberUpdate',
  once: false,
  
  async createEvent(oldMember, newMember) {
    if (oldMember.pending && !newMember.pending) {
      var role = newMember.guild.roles.cache.find(
        (role) => role.name === "registrar"
      );
      newMember.roles.add(role);
    }
  },
};
