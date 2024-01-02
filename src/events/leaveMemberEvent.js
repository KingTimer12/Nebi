const { getChannel } = require('../database/manager/guildManager');
const { remove_profile } = require('../database/manager/userManager');

require('dotenv').config()

module.exports = {
  name: 'Leave Member',
  event: 'guildMemberRemove',
  once: false,
  
  async createEvent(member) {
    if (member.bot) return;
    
    await remove_profile(member.id)

    const guild = member.guild
    const forumId = await getChannel(guild, {channelName:'forum'})
    if (forumId == undefined) return

    const forumChannel = guild.channels.cache.find(
      (chn) => chn.id === forumId
    );
    if (forumChannel == undefined) return

    const leaveServer = forumChannel.availableTags.find(r => r.name == 'Saiu do Servidor')
    const close = forumChannel.availableTags.find(r => r.name == 'Fechado')
    if (leaveServer == undefined || close == undefined) return

    const leaveTag = leaveServer.id
    const closeTag = close.id
    if (leaveTag == undefined && closeTag == undefined) return

    const topicThread = forumChannel.threads.cache.find(thread => thread.name == member.user.tag.replace('#', ''))
    if (topicThread == undefined) return
    topicThread.setAppliedTags([leaveTag, closeTag])
  },
};
