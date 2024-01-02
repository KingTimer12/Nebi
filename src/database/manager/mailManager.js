const MailSchema = require('../schemas/mailSchema')
const MailSenderSchema = require('../schemas/mailSenderSchema')

const getAllMessages = async () => await MailSchema.find()

const createMessage = async (sender, receiver, body) => {
    // checa tamanho da mensagem, se usuário está mutado ou banido, se já enviou
    // ao destinatário, se já enviou a cota do dia ou do evento, então cria nova
    // mensagem

    if (body.length > 2000) throw Error("Mensagem muito longa");
    const date = new Date();
    const senderData = await MailSenderSchema.findOne({ userId: sender });

    if (!senderData) {
        const mailSender = new MailSenderSchema({ userId: sender, muteTimeout: null, banned: false })
        await mailSender.save().catch(console.error);
    } else if (senderData.muteTimeout > date) {
        const time = senderData.muteTimeout.getTime()
        const timestampInSecond = Math.floor(time / 1000);
        throw Error(`Remetente será desmutado <t:${timestampInSecond}:R>`);
    } else if (senderData.banned)
        throw Error('Remetente está banido do evento');

    date.setHours(0, 0, 0, 0)
    if (await MailSchema.findOne({ sender: sender, receiver: receiver }))
        throw Error("Remetente já enviou uma mensagem ao destinatário");

    const mail = new MailSchema({ sender: sender, receiver: receiver, date: date, body: body })
    await mail.save().catch(console.error);
    return
}

const muteUser = async (userId) => {
    // coloca um castigo de 24 horas no usuário
    const done = function (error, success) {
        if (error) {
            console.log(error);
        }
    };
    const dayInMs = 24 * 60 * 60 * 1000;
    const date = new Date()
    date.setTime(date.getTime() + dayInMs);

    const filter = { userId: userId }
    const update = { $set: { muteTimeout: date } }

    await MailSenderSchema.findOneAndUpdate(filter, update, done).clone()
    return
}

const banUser = async (userId) => {
    // coloca o status de banimento do usuário como verdadeiro
    const done = function (error, success) {
        if (error) {
            console.log(error);
        }
    };

    const filter = { userId: userId }
    const update = { $set: { banned: true } }

    await MailSenderSchema.findOneAndUpdate(filter, update, done).clone()
    return
}

const deleteMessage = async (sender, receiver) => {
    await MailSchema.deleteOne({ sender: sender, receiver: receiver })
}

const deleteAllSenderMessages = async (sender) => {
    await MailSchema.deleteMany({ sender: sender })
}

module.exports = {
    getAllMessages,
    createMessage,
    deleteMessage,

    deleteAllSenderMessages,
    muteUser,
    banUser
}