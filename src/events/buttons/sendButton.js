const { uploadImg } = require("../../utils/imgurApi");
const { emojis } = require("../../utils/emotes.json");
const { getNextSunday, toMoment, sundayTimestamp } = require("../../utils/timerApi");
const { getDraw, removeDraw } = require("../../database/handler/drawHandler");
const {
  fetchUserDraw,
  createAndSaveUserDraw,
} = require("../../database/manager/drawManager");

module.exports = {
  customId: "send",
  async execute(interaction) {
    const { user } = interaction;
    const userId = user.id;

    let drawsCurrent = [];

    const draw = getDraw(userId);
    if (draw == undefined) return;
    removeDraw(userId); //Limpar cache

    const userDraw = await fetchUserDraw(userId);
    if (userDraw && userDraw.draws) drawsCurrent = userDraw.draws;

    const int = draw.interaction;

    let description = draw.description == null ? "no" : draw.description;
    if (description.length > 10) {
      description = description.slice(0, 10);
    }
    await uploadImg(draw.link, draw.name, description).then(async (dataImg) => {

      const dateInt = sundayTimestamp()
      const dateString = toMoment(Date.now()).weekday() == 0 ? ", hoje" : ` <t:${parseInt(dateInt)}:R>`;

      const drawResult = {
        name: draw.name,
        type: draw.type,
        link: dataImg.link,
        description: draw.description,
      };

      drawsCurrent.push(drawResult);

      await createAndSaveUserDraw(user, drawsCurrent)
        .then(async () => {
          await int.editReply({
              content: `${emojis["ready"]} A imagem foi salva e será enviada no mural${dateString}!`,
              components: [],
              files: [],
              ephemeral: true,
            })
            .catch(console.log);
        })
        .catch(console.log);
    });
  },
};
