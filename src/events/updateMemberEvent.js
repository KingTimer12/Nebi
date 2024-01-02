const { getRole } = require("../database/manager/guildManager");
const { update_badges } = require("../database/manager/userManager");
const { updateNicknameRow } = require("../utils/googleApi/rankApi");

module.exports = {
  name: 'Update Member',
  event: 'guildMemberUpdate',
  once: false,
  
  async createEvent(oldMember, newMember) {

    const sheetId = 755009417;
    await updateNicknameRow(sheetId, oldMember, newMember)
    await update_badges(newMember)

  },
};
