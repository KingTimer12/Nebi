const { array } = require('../managers/forumManager');
const { getter } = require('../utils/firebaseGuildApi');

require('dotenv').config()

module.exports = {
  name: 'Leave Member',
  event: 'guildMemberRemove',
  once: false,
  
  async createEvent(member) {
    if (member.bot) return;
    const guild = member.guild
    const genericId = await getter(guild.id, "channel", "forum");
    if (genericId == undefined) return
    const forumChannel = guild.channels.cache.find(
      (chn) => chn.id === genericId
    );
    if (forumChannel == undefined) return
    const leaveTag = array().find(r => r.name == 'Saiu do Servidor').id
    const closeTag = array().find(r => r.name == 'Fechado').id
    if (leaveTag == undefined && closeTag == undefined) return
    const topicThread = forumChannel.threads.cache.find(thread => thread.name == member.user.tag.replace('#', ''))
    if (topicThread == undefined) return
    topicThread.setAppliedTags([leaveTag, closeTag])
    
    //console.log('leave forum member')
  },
};
