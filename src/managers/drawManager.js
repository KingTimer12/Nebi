const { getData } = require("../utils/firebase/firabaseDraw");
const { toMoment } = require("../utils/timerApi");

let drawsCache = [];

const add = (week, userId, drawName, type, comments, url, interaction) => {
  drawsCache.push({
    week: week,
    userId: userId,
    drawName: drawName,
    type: type,
    comments: comments,
    url: url,
    interaction: interaction,
  });
};

const set = (array) => {
  drawsCache = array;
};

const array = () => {
  return drawsCache;
};

const removeElement = (obj) => {
  const index = drawsCache.indexOf(obj);
  drawsCache.splice(index, 1);
  set(drawsCache);
};

const hasSend = async (week) => {
  const data = await getData(week);
  const eventDate = toMoment(data);
  const currentDate = toMoment(Date.now());
  return eventDate.dayOfYear() == currentDate.dayOfYear();
};

module.exports = { add, array, set, removeElement, hasSend };
