const { saveUser } = require("../manager/userManager")
const UserModel = require("../model/userModel")

const users = []

const addUser = (user) => {
    const userModel = new UserModel(user.id, user.username, 1, 0)
    users.push(userModel)
    return userModel
}

const getUser = (userId) => {
    return users.find(user => user.userId == userId)
}

const updateAllUsers = async () => {
    for (const userModel of users) {
        await saveUser(userModel)
    }
    delete users
}

module.exports = {addUser, getUser, updateAllUsers}