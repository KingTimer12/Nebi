const { saveUser } = require("../manager/userManager")
const UserModel = require("../model/userModel")

let users = []
let userCooldown = []

const addUser = (user) => {
    const userModel = new UserModel(user.id, user.username, 1, 0)
    users.push(userModel)
    return userModel
}

const getUser = (userId) => users.find(user => user.userId == userId)

const updateAllUsers = async () => {
    for (const userModel of users) {
        await saveUser(userModel)
    }
    users = []
    userCooldown = []
    console.log('update database')
}

const addCooldown = (userId) => {
    userCooldown.push(userId)
}

const hasCooldown = (userId) => userCooldown.find(id => id == userId) != undefined

module.exports = {addUser, getUser, updateAllUsers, addCooldown, hasCooldown}