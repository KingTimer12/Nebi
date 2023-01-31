require("dotenv").config();
const { GoogleSpreadsheet } = require("google-spreadsheet");

const getDoc = async () => {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEETID_RANK);

  await doc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
  await doc.loadInfo();
  return doc;
};

const getTutores = async (sheetId) => {
  const doc = await getDoc().catch(console.error);
  if (doc) {
    const array = [];
    const sheet = doc.sheetsById[sheetId];
    const rows = sheet.getRows().catch(console.error);
    if (sheet == undefined) return undefined;
    if (rows) {
      (await rows)
        .filter((row) => row.CargoId != "-")
        .forEach((row) => {
          array.push({ tutor: row.Tutores, roleId: row.CargoId });
        });
    }
    return array;
  }
};

const addDadoRow = async (sheetId, user, tutor) => {
  await getDoc().then(async (doc) => {
    const sheet = doc.sheetsById[sheetId];
    if (sheet == undefined) return;

    const rows = await sheet.getRows();
    if (rows && rows.find((row) => row.TutorandoId == user.id)) {
      rows
        .filter((row) => row.TutorandoId == user.id)
        .forEach((row) => {
          row.Tutor = tutor;
          row.save().then(() => {
            console.log("Dados tutor atualizado!");
          });
        });
    } else {
      sheet.addRow(
        {
          TutorandoId: user.id,
          Tutorando: user.tag,
          Tutor: tutor,
        },
        { raw: true }
      );
    }
  });
};

const updateDadosUserRow = async (sheetId, oldUser, newUser) => {
  await getDoc().then((doc) => {
    const username = newUser.tag;

    const sheet = doc.sheetsById[sheetId];

    if (sheet != undefined || sheet.getRows() != undefined) {
      sheet.getRows().then((rows) => {
        rows
          .filter(
            (row) => row.TutorandoId == oldUser.id && oldUser.tag != newUser.tag
          )
          .map((row) => {
            row.Tutorando = username;
            row.save().then(() => {
              console.log("Dados atual user atualizados!");
            });
          });
      });
    }
  });
};

const updateDadosTutorRow = async (sheetId, user, newTutor) => {
  await getDoc().then((doc) => {
    const sheet = doc.sheetsById[sheetId];

    if (sheet != undefined || sheet.getRows() != undefined) {
      sheet.getRows().then((rows) => {
        rows
          .filter((row) => row.TutorandoId == user.id)
          .map((row) => {
            row.Tutor = newTutor;
            row.save().then(() => {
              console.log("Dados atual user atualizados!");
            });
          });
      });
    }
  });
};

const currentTutor = async (sheetId, user) => {
  const doc = await getDoc().catch(console.error);
  if (doc) {
    const sheet = doc.sheetsById[sheetId];

    if (sheet != undefined || sheet.getRows() != undefined) {
      const rows = sheet.getRows();
      if (rows) {
        const dados = (await rows).find((row) => row.TutorandoId == user.id);
        return dados.Tutor;
      }
    }
  }
};

const hasTutorandoRow = async (sheetId, id) => {
  const doc = await getDoc().catch(console.error);
  if (doc) {
    const sheet = doc.sheetsById[sheetId];
    if (sheet == undefined) return undefined;
    const rows = sheet.getRows();
    if (rows) {
      return (await rows).find((row) => row.Id == id);
    }
  }
  return false;
};

const addTutorandoRow = async (sheetId, id, username, nickname) => {
  getDoc()
    .then(async (doc) => {
      const sheet = doc.sheetsById[sheetId];
      if (sheet == undefined) return;

      const rows = sheet.getRows();
      if (!rows || (await rows).find((row) => row.Id == id)) return;

      sheet
        .addRow(
          {
            Id: id,
            AntigoUsername: "-",
            AtualUsername: username,
            Nickname: nickname,
          },
          {
            raw: true,
          }
        )
        .then(() => {
          console.log(`${username} adicionado na planilha.`);
        })
        .catch(console.error);
    })
    .catch(console.error);
};

const updateNicknameRow = async (sheetId, newMember) => {
  const id = newMember.id;

  let nickname = newMember.nickname;
  if (!nickname) {
    nickname = newMember.user.username;
  }

  await getDoc().then((doc) => {
    const sheet = doc.sheetsById[sheetId];
    if (sheet == undefined || sheet.getRows() == undefined) return;
    sheet.getRows().then((rows) => {
      rows
        .filter((row) => row.Id == id)
        .map((row) => {
          row.Nickname = nickname;
          row.save().then(() => {
            console.log("Dado atualizado!");
          });
        });
    });
  });
};

const updateUsernameRow = async (sheetId, oldUser, newUser) => {
  const id = newUser.id;

  const oldUsername = oldUser.tag;
  const username = newUser.tag;

  await getDoc().then((doc) => {
    const sheet = doc.sheetsById[sheetId];
    if (sheet == undefined || sheet.getRows() == undefined) return;
    sheet.getRows().then((rows) => {
      rows
        .filter((row) => row.Id == id && oldUser.tag != newUser.tag)
        .map((row) => {
          row.AntigoUsername = oldUsername;
          row.AtualUsername = username;
          row.save().then(() => {
            console.log("Dados antigo user e atual user atualizados!");
          });
        });
    });
  });
};

let index = 0;

const addUsersRow = async (role) => {
  {
    const member = role.members.at(index);
    const username = member.user.tag;
    let nickname = member.nickname;
    if (!nickname) {
      nickname = member.user.username;
    }
    await addTutorandoRow(755009417, member.id, username, nickname);
  }
  setInterval(async () => {
    index++;
    const member = role.members.at(index);
    const username = member.user.tag;
    let nickname = member.nickname;
    if (!nickname) {
      nickname = member.user.username;
    }
    await addTutorandoRow(755009417, member.id, username, nickname);
  }, 20 * 1000);
};

module.exports = {
  addTutorandoRow,
  updateUsernameRow,
  updateNicknameRow,
  hasTutorandoRow,
  addDadoRow,
  getTutores,
  addUsersRow,
  updateDadosUserRow,
  updateDadosTutorRow,
  currentTutor,
};
