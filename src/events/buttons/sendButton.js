const { emojis } = require("../../utils/emotes.json");
const {
  toMoment,
  sundayTimestamp,
} = require("../../utils/timerApi");
const {
  getDraw,
  removeDraw
} = require("../../database/handler/drawHandler");
const {
  fetchUserDraw,
  createAndSaveUserDraw,
} = require("../../database/manager/drawManager");
const { getEmoji } = require("../../handlers/emojiHandler");
const { getChannel } = require("../../database/manager/guildManager");

module.exports = {
  customId: "send",
  async execute(interaction) {
    const { user, client } = interaction;
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

    const guild = client.guilds.cache.find(guild => guild.id=='1046080828716896297')
    const imagensDBId = await getChannel(guild, { channelName: "image" });
    const imagesChannel = guild.channels.cache.find(
      (chn) => chn.id === imagensDBId
    );
    if (imagesChannel == undefined) {
      return console.log("Images channel is undefined")
    }
    
    const message = await imagesChannel.send({
      files: [{
        attachment: draw.link,
        name: `${draw.name}.jpg`,
        description: description
      }]
    })
    
    const url = message.attachments.at(0).url
    if (url == undefined) {
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

    const link = `${url}`;

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