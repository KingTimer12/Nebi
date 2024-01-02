const { default: axios } = require("axios");
const { getEmoji } = require("./emojiHandler");

const allFlags = []

const loadFlags = async () => {
    const response = await axios.get('https://restcountries.com/v3.1/all').catch(error => {
        console.error('Erro:', error);
    });
    if (response.status == 200) {
        for (const data of response.data) {
            const flag = String(data.flags.png).replace("https://", "").split("/")[2].replace(".png", "")
            const emoji = String(data.flag)
            if (emoji) {
                allFlags.push({
                    name: flag,
                    emoji: emoji
                })
            }
        }
        allFlags.push({
            name: "xm",
            emoji: "<:flag_xm:1174062877007679528>"
        })
    }
    
}

const getFlag = (name) => {
    const flag = allFlags.find(flag => flag.name == name)
    if (flag) {
        return flag.emoji
    }
    return undefined
}

const getFlags = () => allFlags

module.exports = {loadFlags, getFlag, getFlags}