const { updateUsernameRow } = require("../utils/googleApi/rankApi");

module.exports = {
  name: 'Update User',
  event: 'userUpdate',
  once: false,
  
  async createEvent(oldUser, newUser) {
    await updateUsernameRow(755009417, oldUser, newUser)
  },
};
