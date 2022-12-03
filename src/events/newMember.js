module.exports = {
  createEvent(member) {
    if (member.bot) return;

    var role = member.guild.roles.cache.find((role) => role.name === "registrar");
    member.roles.add(role);

  },
};
