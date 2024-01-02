const { Schema, model } = require("mongoose");

const MailSenderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    muteTimeout: Date,
    banned: Boolean,
})

module.exports = model('mailSender', MailSenderSchema)