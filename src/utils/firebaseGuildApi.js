const { db } = require("../managers/firebaseManager");
const { ref, child, get, set } = require("firebase/database");

const setter = async (guildId, type, name, genericId) => {
  const dbRef = ref(db());
  await set(child(dbRef, `Guilds/${guildId}/${type}/${name}`), {
    id: genericId,
  });
};

const getter = async (guildId, type, name) => {
  const dbRef = ref(db());
  let id = undefined;
  await get(child(dbRef, `Guilds/${guildId}/${type}/${name}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
        id = await snapshot.val().id;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return id;
};

module.exports = { setter, getter };
