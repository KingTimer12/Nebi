const { db } = require("../managers/firebaseManager");
const { ref, child, get, set } = require("firebase/database");

//Checar se já enviou antes
const hasSent = async (userId) => {
  const dbRef = ref(db());
  let bool = false;
  await get(child(dbRef, `Forms/${userId}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      bool = await snapshot.val().stats;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return bool;
};

//Pegar o id da mensagem para sobrescrever
const getAnswer = async (userId) => {
  const dbRef = ref(db());
  let messageId = "";
  await get(child(dbRef, `Forms/${userId}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      messageId = await snapshot.val().answer;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return messageId;
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

const sendApp = async (userId, data, answer) => {
  const dbRef = ref(db());
  await set(child(dbRef, `Forms/${userId}`), {
    stats: "true",
    data: data,
    answer: answer,
  });
};

module.exports = { hasSent, sendApp, getData, getAnswer };
