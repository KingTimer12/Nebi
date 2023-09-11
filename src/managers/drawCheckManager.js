const { EmbedBuilder } = require("discord.js");
const {
  listUserDraw,
  saveUserDraw,
  resetUserDraw
} = require("../database/manager/drawManager");
const { getThemes, setThemes } = require("../database/manager/guildManager");
const { toMoment } = require("../utils/timerApi");
const data = require("../config/themes.json")

const checkingDraw = async (guild, drawChannel) => {
  if (!guild) return;
  const currentDate = toMoment(Date.now());

  if (currentDate.weekday() == 0) {
    console.log("CHECKING DRAW...");
    await sendDraws(drawChannel)
  } else if (
    currentDate.weekday() == 1 &&
    currentDate.hours() == 0 &&
    currentDate.minutes() == 20
  ) {
    await resetUserDraw();
    console.log("[DrawEvent] Update event for next sunday.");
    await sendThemeChoose(guild, drawChannel)
  } else if (
    currentDate.weekday() == 2 &&
    currentDate.hours() == 0 &&
    currentDate.minutes() == 0
  ) {
    await sendTheme(drawChannel)
  }
};

const sendTheme = async (drawChannel) => {
  const lastMessageId = drawChannel.lastMessageId
  console.log(lastMessageId)
  const lastMessage = await drawChannel.messages.fetch(lastMessageId)

  let result = ""
  let resultCache = []
  if (lastMessage) {
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"]
    const emojiCache = []

    for (const reaction of lastMessage.reactions.cache) {
      const emojiCount = reaction[1].count
      const emojiName = reaction[0]
      emojiCache.push({
        name: emojiName,
        count: emojiCount
      })
    }
    resultCache = emojiCache.filter(f => emojis.includes(f.name)).sort((a, b) => b.count - a.count);
  } else return console.log("Last message não existe")

  const description = lastMessage.embeds[0].description
  const regex = /(\d+️⃣) - ([^\d]+)/g;
  const matches = [...description.matchAll(regex)];

  // Extraia os emojis e os temas
  const temas = matches.map(match => `${match[1]}-${match[2]}`);
  const tema1 = temas.find(t => t.split("-")[0] == resultCache[0].name).split("-")[1].replace("\n" , "")
  const tema2 = temas.find(t => t.split("-")[0] == resultCache[1].name).split("-")[1].replace("\n", "")

  result = `${tema1} e/ou ${tema2}`

  const desenhosDaSemana = "<@&874402148673286195>"
  const embed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle('Mural de desenhos')
    .setDescription(
      `Os temas são: ${result}

      **Entregar até ESSE DOMINGO pelo comando /mural enviar. Caso não consiga pelo comando, mandem no PV do Timer.**`
    )
  await drawChannel
    .send({
      content: desenhosDaSemana,
      embeds: [embed],
    })
    .catch(console.log);
}

const sendThemeChoose = async (guild, drawChannel) => {
  const maxLength = 120
  let themeNumber = 0;
  const themesDatabase = await getThemes(guild)
  const themes = []
  while (themeNumber < 7) {
    const index = Math.floor(Math.random() * maxLength);
    const theme = data[`${index}`];
    if (!theme) continue
    if (themesDatabase.includes(theme)) continue;
    if (themes.includes(theme)) continue;
    themes.push(theme)
    themesDatabase.push(theme)
    themeNumber++;
  }

  await setThemes(guild.id, themesDatabase)

  const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"]

  let messageTheme = ""
  for (let i = 0; i < themeNumber; i++) {
    messageTheme += `${emojis[i]} - **${themes[i]}**\n`
  }

  const desenhosDaSemana = "<@&874402148673286195>"
  const embed = new EmbedBuilder()
    .setColor("Orange")
    .setTitle('Mural de desenhos')
    .setDescription(
      `Acima estão os desenhos da semana passada.
        
        Votação para esse semana:
        ${messageTheme}
        
        Votem em dois itens para escolher os temas.
        
        **OBS: Usem o comando /mural enviar**`
    )

  const messageResponse = await drawChannel
    .send({
      content: desenhosDaSemana,
      embeds: [embed],
    })
    .catch(console.log);
  try {
    for (const emoji of emojis) {
      await messageResponse.react(emoji);
    }
  } catch (error) {
    console.error('One of the emojis failed to react:', error);
  }
}

const sendDraws = async (drawChannel) => {
  const list = await listUserDraw();
  let embeds = [];
  for (const obj of list) {
    for (const draw of obj.draws) {
      const msgComments =
        draw.description != undefined ? `Comentário: ${draw.description}` : "";
      embeds.push(
        new EmbedBuilder()
          .setColor("Orange")
          .setTitle(draw.name)
          .setDescription(
            `Tipo: **${draw.type}**\nAutor(a): <@!${obj.userId}>\n${msgComments}`
          )
          .setImage(draw.link)
      );
    }

    saveUserDraw(obj.userId);
  }

  if (embeds.length) {
    embeds.forEach(async (embed) => {
      await drawChannel
        .send({
          embeds: [embed],
        })
        .catch(console.log);
    });
  }
};

module.exports = { checkingDraw, sendTheme, sendThemeChoose };