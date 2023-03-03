const DrawModel = require("../model/drawModel");

const users = new Map()

const createUserDraw = (userId, interaction) => {
  updateDraw(userId, new DrawModel(interaction))
}

const getDraw = (userId) => {
  return users.get(userId)
}

const updateDraw = (userId, draw) => {
  users.set(userId, draw)
}

const removeDraw = (userId) => {
  users.delete(userId)
}

module.exports = { createUserDraw, getDraw, updateDraw, removeDraw };
