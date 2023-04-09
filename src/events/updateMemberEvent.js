const { getter } = require("../utils/firebase/firebaseGuildApi");
const { updateNicknameRow } = require("../utils/googleApi/rankApi");

module.exports = {
  name: 'Update Member',
  event: 'guildMemberUpdate',
  once: false,
  
  async createEvent(oldMember, newMember) {

    await updateNicknameRow(755009417, oldMember, newMember)

  },
};
