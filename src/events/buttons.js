const { array, set, removeElement } = require("../managers/drawManager");
const { sendDraw, getData } = require("../utils/firebase/firabaseDraw");
const { getter } = require("../utils/firebase/firebaseGuildApi");
const { uploadImg } = require("../utils/imgurApi");
const { emojis } = require("../utils/emotes.json");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const { TextInputComponent, Modal, showModal } = require("discord-modals");
const { remove } = require("firebase/database");

module.exports = {
  name: "Buttons",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction) {
    if (!interaction.isButton()) return;
    const { member, customId, guildId, user, client } = interaction;
    const userId = user.id;

    if (customId == "next") {
      const rolesChannelId = await getter(guildId, "channel", "roles");
      const rolesRoleId = await getter(guildId, "role", "roles");
      const registerRoleId = await getter(guildId, "role", "register");

      if (rolesChannelId == undefined) {
        return interaction.reply({
          content:
            "O canal `cargos` não está setado! Comunique para algum administrador sobre o ocorrido.",
          ephemeral: true,
        });
      }

      const registerRole = member.roles.cache.find(
        (role) => role.id === registerRoleId
      );

      if (registerRole == undefined)
        return interaction.reply({
          content: `Você já está liberado para explorar o servidor!`,
          ephemeral: true,
        });
      const role = member.guild.roles.cache.find(
        (role) => role.id === rolesRoleId
      );
      const rolesRole = member.roles.cache.find((r) => r === role);
      if (rolesRole !== undefined) {
        return interaction.reply({
          content: `Você já tem acesso ao segundo passo! Vá para o chat <#${rolesChannelId}>.`,
          ephemeral: true,
        });
      }
      member.roles.add(role);
      return interaction.reply({
        content: `Siga para o próximo passo no chat <#${rolesChannelId}>!`,
        ephemeral: true,
      });
    }
    if (customId == "edit-all") {
      const modal = new Modal()
        .setCustomId("modal-md-edit")
        .setTitle("Mural dos Desenhos da Semana")
        .addComponents(
          new TextInputComponent()
            .setCustomId("draw-name")
            .setStyle("SHORT")
            .setLabel("Título/nome do desenho:")
            .setPlaceholder("")
            .setRequired(true),
          new TextInputComponent()
            .setCustomId("type")
            .setStyle("SHORT")
            .setLabel("Tipo:")
            .setPlaceholder(
              "Exemplos de tipo: original, fanart, releitura, cópia, etc..."
            )
            .setRequired(true),
          new TextInputComponent()
            .setCustomId("comments")
            .setStyle("LONG")
            .setLabel("Comentário:")
            .setPlaceholder(
              "O máximo de caracteres é 1000! Mais do que isso não será enviado."
            )
            .setRequired(false)
        );
      return showModal(modal, { client: client, interaction: interaction });
    }
    if (customId == "back") {
      const list = array();
      const obj = list.find((l) => l.userId == userId);
      if (obj == undefined) return;

      const comments = obj.comments;
      const drawName = obj.drawName;
      const type = obj.type;
      const url = obj.url;

      const int = obj.interaction;

      const msgComments = comments != undefined ? `${comments}` : "~~vazio~~";
      let msgFinal =
        `Veja se todas as informações estão corretas. Caso estejam, clique no botão **enviar**.\n` +
        `Houve algum erro? Clique em **editar** para corrigir.\n\n` +
        `Título: ${drawName}\nTipo: ${type}\nComentário: ${msgComments}\nImagem:`;

      const send = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("send")
          .setEmoji({ id: "1051884166276460604", name: "send" })
          .setLabel("Enviar")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("edit")
          .setEmoji("✏️")
          .setLabel("Editar")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setEmoji({ id: "1051884167782219776", name: "error" })
          .setLabel("Cancelar")
          .setStyle(ButtonStyle.Danger)
      );
      return await interaction.deferUpdate().then(() => {
        int
          .editReply({
            content: msgFinal,
            files: [{ attachment: url, name: `${drawName}.png` }],
            components: [send],
            ephemeral: true,
          })
          .catch((err) => {});
      });
    }
    if (customId == "edit") {
      const list = array();
      const obj = list.find((l) => l.userId == userId);
      if (obj == undefined) return;
      const int = obj.interaction;

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

      return await interaction.deferUpdate().then(() => {
        int.editReply({
          content: `O que deseja alterar? ${emojis["entendo"]}`,
          components: [row2, row],
          files: [],
          ephemeral: true,
        });
      });
    }
    if (customId == "send") {
      const list = array();
      const obj = list.find((l) => l.userId == userId);
      if (obj == undefined) return;
      const int = obj.interaction;

      removeElement(obj);
      console.log(array());

      let comments = obj.comments == null ? "no" : obj.comments;
      if (comments.length > 10) {
        comments = comments.slice(0, 10);
      }
      await uploadImg(obj.url, obj.drawName, comments).then(async (dataImg) => {
        const data = await getData(obj.week);
        const dataInt = parseInt(data / 1000);

        await sendDraw(
          obj.week,
          obj.userId,
          obj.drawName,
          obj.type,
          obj.comments,
          dataImg.link
        ).then(() =>
          int.editReply({
            content: `${emojis["ready"]} A imagem foi salva e será enviada no mural <t:${dataInt}:R>!`,
            components: [],
            files: [],
            ephemeral: true,
          })
        );
      });
    }
  },
};
