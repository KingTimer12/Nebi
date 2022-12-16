const { db } = require("../../managers/firebaseManager");
const { ref, child, get, set } = require("firebase/database");

const getData = async (week) => {
  const dbRef = ref(db());
  let data = undefined;
  await get(child(dbRef, `DrawEvent/${week}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      data = await snapshot.val().data;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return data;
};

const listDraws = async (week) => {
  const dbRef = ref(db());
  let array = [];
  await get(child(dbRef, `DrawEvent/${week}`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      array = Object.keys(await snapshot.val());
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return array;
};

const getWeek = async () => {
  const dbRef = ref(db());
  let week = 0;
  await get(child(dbRef, `DrawEvent`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      const array = Object.keys(await snapshot.val());
      week = array.length;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return week;
};

const createEvent = async (week, data) => {
  const dbRef = ref(db());
  await set(child(dbRef, `DrawEvent/${week}`), {
    data: data,
  });
};

const getInfo = async (week, userId) => {
  const dbRef = ref(db());
  let data = [];
  const array = await listDraw(week, userId);
  for (const drawNumber of array) {
    if (drawNumber == 'enable') continue
    await get(child(dbRef, `DrawEvent/${week}/${userId}/${drawNumber}`)).then(
      async (snapshot) => {
        if (snapshot.exists()) {
          const drawName = await snapshot.val().drawName;
          const type = await snapshot.val().type;
          const comments = await snapshot.val().comments;
          const url = await snapshot.val().url;
          const enable = await snapshot.val().enable;
          data.push({
            drawName: drawName,
            type: type,
            comments: comments,
            url: url,
            enable: enable,
          });
          new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    );
  }
  new Promise((resolve) => setTimeout(resolve, 120));
  return data;
};

const listDraw = async (week, userId) => {
  const dbRef = ref(db());
  const path = `DrawEvent/${week}/${userId}`;

  let draw = [];
  await get(child(dbRef, path)).then(async (snapshot) => {
    if (snapshot.exists()) {
      draw = Object.keys(await snapshot.val());
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return draw;
};

const numberDraw = async (week, userId) => {
  const dbRef = ref(db());
  const path = `DrawEvent/${week}/${userId}`;

  let draw = 0;
  await get(child(dbRef, path)).then(async (snapshot) => {
    if (snapshot.exists()) {
      const array = Object.keys(await snapshot.val());
      draw = array.length-1;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return draw;
};

const setEnable = async (week, userId, enable) => {
  const dbRef = ref(db());
  const path = `DrawEvent/${week}/${userId}`;

  await set(child(dbRef, `${path}`), {
    enable: enable,
  });
};

const getEnable = async (week, userId) => {
  const dbRef = ref(db());
  const path = `DrawEvent/${week}/${userId}`;

  let data = false;
  await get(child(dbRef, path)).then(async (snapshot) => {
    if (snapshot.exists()) {
      data = await snapshot.val().enable;
    }
  });
  new Promise((resolve) => setTimeout(resolve, 150));
  return data;
};

const sendDraw = async (week, userId, drawName, type, comments, url) => {
  const dbRef = ref(db());
  const path = `DrawEvent/${week}/${userId}`;

  await setEnable(week, userId, true)

  let draw = await numberDraw(week, userId);
  await set(child(dbRef, `${path}/${draw + 1}`), {
    drawName: drawName,
    type: type,
    comments: comments,
    url: url
  });
};

module.exports = {
  getWeek,
  sendDraw,
  createEvent,
  getData,
  listDraws,
  getInfo,
  setEnable,
  getEnable
};
