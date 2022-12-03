const { google } = require("googleapis");
require('dotenv').config()

const service = google.sheets("v4");
//const credentials = require("../../credentials.json");
const authClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

const id = process.env.SPREADSHEETID
const range = 'Respostas ao formulário 1'

const checkSheetTitle = async () => {
    const token = await authClient.authorize();
    authClient.setCredentials(token);
    const metadata = await service.spreadsheets.get({
        auth: authClient,
        spreadsheetId: id
    })
    console.log(metadata.data.sheets)
}

const listValues = async () => {
    const token = await authClient.authorize();
    authClient.setCredentials(token);
    const res = await service.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: id,
        range: range,
    });
    return res.data.values
}

module.exports = {
    listValues, checkSheetTitle
}