const { db } = require("../managers/firebaseManager");
const { ref, child, get, set } = require("firebase/database");

//Pegar a tag de envio
const getTag = async (userId) => {
  const dbRef = ref(db());
  let data = undefined;
  await get(child(dbRef, `Forms/${userId}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      data = await snapshot.val().oldTag;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return data;
};

//Pegar a data de envio
const getData = async (userId) => {
  const dbRef = ref(db());
  let data = "";
  await get(child(dbRef, `Forms/${userId}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      data = await snapshot.val().data;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return data;
};

//Pegar as mensagens de envio
const getMessagesId = async (userId) => {
  const dbRef = ref(db());
  let data = [];
  await get(child(dbRef, `Forms/${userId}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      data = await snapshot.val().messagesId;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return data;
};

const sendApp = async (userId, data, oldTag, messagesId) => {
  const dbRef = ref(db());
  await set(child(dbRef, `Forms/${userId}`), {
    data: data,
    oldTag: oldTag,
    messagesId: messagesId,
  });
};

module.exports = { sendApp, getTag, getData, getMessagesId };
