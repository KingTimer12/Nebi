const drawSchema = require("../schemas/drawSchema");

const fetchUserDraw = async (userId) =>
  await drawSchema.findOne({ userId: userId });

const createAndSaveUserDraw = async (user, draws) => {
  if (user == undefined || user.id == undefined) return;
  
  let drawEvent = await saveUserDraw(user.id, draws);
  if (drawEvent) return drawEvent

  drawEvent = new drawSchema({ userId: user.id, draws: draws });
  await drawEvent
    .save()
    .then(() => console.log("{DrawEvent} Created user"))
    .catch(console.error);
  return drawEvent;
};

const saveUserDraw = async (userId, draws = []) => {

  const filter = { userId: userId };
  const update = { $set: {draws: draws} };

  const updateOne = await drawSchema.findOneAndUpdate(
    filter, update, { new: true }
  );
  return updateOne
};

const listUserDraw = async () => {
  return await drawSchema.find({})
}

const resetUserDraw = async () => {
  console.log('reset')
  return await drawSchema.collection.drop()
}

module.exports = {
  fetchUserDraw,
  createAndSaveUserDraw,
  saveUserDraw,
  listUserDraw,
  resetUserDraw
};