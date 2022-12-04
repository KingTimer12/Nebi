module.exports = {
  name: 'New Member',
  event: 'guildMemberAdd',
  once: false,
  
  createEvent(member) {
    if (member.bot) return;

  },
};
