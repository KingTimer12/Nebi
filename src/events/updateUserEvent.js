const { updateUsernameRow, updateDadosUserRow } = require("../utils/googleApi/rankApi");

module.exports = {
  name: 'Update User',
  event: 'userUpdate',
  once: false,
  
  async createEvent(oldUser, newUser) {
    await updateUsernameRow(755009417, oldUser, newUser)
    await updateDadosUserRow(1365207529, oldUser, newUser)
  },
};
