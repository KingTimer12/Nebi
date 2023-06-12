const userPerMessage = new Map()

const set = (userId, targetId) => {
    userPerMessage.set(userId, targetId)
}

const get = (userId) => userPerMessage.get(userId)

const remove = (userId) => {
    userPerMessage.delete(userId)
}

module.exports = {set, get, remove}