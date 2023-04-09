const { uploadImg } = require("../../utils/imgurApi");
const { emojis } = require("../../utils/emotes.json");
const {
  getNextSunday,
  toMoment,
  sundayTimestamp,
} = require("../../utils/timerApi");
const {
  getDraw,
  removeDraw,
  cacheDraw,
} = require("../../database/handler/drawHandler");
const {
  fetchUserDraw,
  createAndSaveUserDraw,
} = require("../../database/manager/drawManager");
const { getEmoji } = require("../../handlers/emojiHandler");

module.exports = {
  customId: "send",
  async execute(interaction) {
    const { user } = interaction;
    const userId = user.id;

    let drawsCurrent = [];

    const draw = getDraw(userId);
    if (draw == undefined) {
      return await interaction
        .reply({
          content: `${emojis["error"]} Ops, todo os dados em cache foram perdidos! Por gentileza, comece novamente.`,
          components: [],
          files: [],
          ephemeral: true,
        })
        .catch(console.log);
    }

    const int = draw.interaction;

    await int
      .editReply({
        content: `${getEmoji("loading")} ┃ Limpando cache... (1/3)`,
        components: [],
        files: [],
        ephemeral: true,
      })
      .catch(console.log);
    removeDraw(userId); //Limpar cache

    const userDraw = await fetchUserDraw(userId);
    if (userDraw && userDraw.draws) drawsCurrent = userDraw.draws;

    let description = draw.description == null ? "no" : draw.description;
    if (description.length > 10) {
      description = description.slice(0, 10);
    }

    await int
      .editReply({
        content: `${getEmoji("loading")} ┃ Fazendo upload do desenho... (2/3)`,
        components: [],
        files: [],
        ephemeral: true,
      })
      .catch(console.log);

    let dataImg = undefined;
    try {
      dataImg = await uploadImg(draw.link, draw.name, description);
    } catch (error) {
      console.error(error);
    }
    if (!dataImg) {
      return await int
        .editReply({
          content: `${emojis["error"]} Os dados da imagem não foram identificados.`,
          components: [],
          files: [],
          ephemeral: true,
        })
        .catch(console.log);
    }
    const dateInt = sundayTimestamp();
    const dateString =
      toMoment(Date.now()).weekday() == 0
        ? ", hoje"
        : ` <t:${parseInt(dateInt)}:R>`;

    const link = `${dataImg.link}`;

    console.log(link);

    if (!link.startsWith("https://i.imgur.com")) {
      if (toMoment(Date.now()).weekday != 0) {
        return await int
          .editReply({
            content: `${emojis["error"]} A API de upload de imagem atingiu o limite! Espere para mandar novamente. O sistema de repescagem só acontece no domingo.`,
            components: [],
            files: [],
            ephemeral: true,
          })
          .catch(console.log);
      } else {
        cacheDraw(userId, draw);
        return await int
          .editReply({
            content: `${emojis["entendo"]} A API de upload de imagem atingiu o limite! Seu desenho foi colocado na cache de repescagem! Não se preocupe, pois será enviado mesmo depois das 00:00.`,
            components: [],
            files: [],
            ephemeral: true,
          })
          .catch(console.log);
      }
    }

    const drawResult = {
      name: draw.name,
      type: draw.type,
      link: link,
      description: draw.description,
    };

    drawsCurrent.push(drawResult);

    await int
      .editReply({
        content: `${getEmoji("loading")} ┃ Salvando no banco de dados... (3/3)`,
        components: [],
        files: [],
        ephemeral: true,
      })
      .catch(console.log);
    let result = undefined;
    try {
      result = await createAndSaveUserDraw(user, drawsCurrent);
    } catch (error) {
      console.error(error);
    }
    if (!result) {
      return await int
        .editReply({
          content: `${emojis["error"]} Ocorreu um erro ao armazenar no banco de dados.`,
          components: [],
          files: [],
          ephemeral: true,
        })
        .catch(console.log);
      return;
    }

    await int
      .editReply({
        content: `${getEmoji("loading")} ┃ Finalizando o processo...`,
        components: [],
        files: [],
        ephemeral: true,
      })
      .catch(console.log);

    await int
      .editReply({
        content: `${emojis["ready"]} A imagem será enviada no mural${dateString}!`,
        components: [],
        files: [],
        ephemeral: true,
      })
      .catch(console.log);
  },
};
