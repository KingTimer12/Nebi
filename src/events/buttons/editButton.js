const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const { getDraw } = require("../../database/handler/drawHandler");
const { array } = require("../../managers/drawManager");
const { emojis } = require("../../utils/emotes.json");

module.exports = {
  customId: "edit",
  async execute(interaction) {
    const { user } = interaction;
    const userId = user.id;

    const drawObj = getDraw(userId)
    if (drawObj == undefined) return;
    const int = drawObj.interaction;

    const row2 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-question")
        .setPlaceholder("Selecione um dos campos!")
        .addOptions([
          {
            label: "Título",
            value: "title",
          },
          {
            label: "Tipo",
            value: "type",
          },
          {
            label: "Comentário",
            value: "comment",
          },
          {
            label: "Imagem",
            value: "image",
          },
        ])
    );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back")
        .setEmoji({ id: "1052987490321039390", name: "back" })
        .setLabel("Voltar")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("edit-all")
        .setEmoji("✏️")
        .setLabel("Editar tudo")
        .setStyle(ButtonStyle.Success)
    );

    return await interaction.deferUpdate().then(async () => {
      await int.editReply({
        content: `O que deseja alterar? ${emojis["entendo"]}`,
        components: [row2, row],
        files: [],
        ephemeral: true,
      }).catch(console.log);
    }).catch(console.log);
  },
};
