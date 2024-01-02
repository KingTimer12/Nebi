const { Schema, model } = require("mongoose");

const MailSchema = new Schema({
    sender: String,
    receiver: String,
    date: Date,
    body: String
})

module.exports = model('mail', MailSchema)