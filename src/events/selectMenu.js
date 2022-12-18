const { array, add, removeElement } = require("../managers/drawManager");
const { getter } = require("../utils/firebase/firebaseGuildApi");
const { emojis } = require("../utils/emotes.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getData, createEvent } = require("../utils/firebase/firabaseDraw");
const { getNextSunday } = require("../utils/timerApi");

async function awaitMessage(interaction) {
  const filter = (msg) => interaction.user.id == msg.author.id;
  const sendedMessage = interaction.channel
    .awaitMessages({ max: 1, time: 300_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { content: undefined, message: msgFirst };

      const text = msgFirst.content;
      if (text != undefined) response.content = text;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

async function awaitImage(interaction) {
  const filter = (msg) =>
    interaction.user.id == msg.author.id && msg.attachments.size > 0;
  const sendedMessage = interaction.channel
    .awaitMessages({ max: 1, time: 300_000, errors: ["time"], filter })
    .then(async (msg) => {
      const msgFirst = await msg.first();
      const response = { url: undefined, message: msgFirst };

      const img = msgFirst.attachments.at(0);
      if (img != undefined) response.url = img.url;

      return response;
    })
    .catch(console.error);
  return sendedMessage;
}

module.exports = {
  name: "Select Menu",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    const { member, guildId, guild, values, customId, user } = interaction;
    const userId = user.id;

    if (customId === "select-question") {
      const selected = values[0];
      const list = array();
      const obj = list.find((l) => l.userId == userId);
      if (obj == undefined) return;
      const int = obj.interaction;
      const week = obj.week;

      let drawName = obj.drawName;
      let type = obj.type;
      let comments = obj.comments;
      let url = obj.url;

      if (selected == "title") {
        return await interaction.deferUpdate().then(() => {
          int
            .editReply({
              content: `${emojis["send"]} Digite qual será o novo título:`,
              files: [],
              components: [],
              ephemeral: true,
            })
            .then(async () => {
              const collectedMessage = await awaitMessage(int);
              if (collectedMessage != undefined) {
                setTimeout(
                  async () => await collectedMessage.message.delete(),
                  90
                );
                const text = collectedMessage.content;
                let data = undefined;
                if (week > 0) {
                  data = await getData(week);
                } else {
                  data = getNextSunday().getTime();
                  await createEvent(1, data);
                }
                removeElement(obj);
                add(week, userId, text, type, comments, url, int);

                const msgComments =
                  comments != undefined ? `${comments}` : "~~vazio~~";
                let msgFinal =
                  `Veja se todas as informações estão corretas. Caso estejam, clique no botão **enviar**.\n` +
                  `Houve algum erro? Clique em **editar** para corrigir.\n\n` +
                  `Título: ${text}\nTipo: ${type}\nComentário: ${msgComments}\nImagem:`;

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

                int
                  .editReply({
                    content: msgFinal,
                    files: [{ attachment: url, name: `${text}.png` }],
                    components: [send],
                    ephemeral: true,
                  })
                  .catch(console.log);
              } else {
                int.editReply({
                  content:
                    emojis["error"] +
                    " Você demorou demais para enviar o título! Use o comando `/enviar` novamente.",
                  ephemeral: true,
                });
              }
            })
            .catch(console.log);
        });
      } else if (selected == "type") {
        return await interaction.deferUpdate().then(() => {
          int
            .editReply({
              content: `${emojis["send"]} Digite qual será o novo tipo:`,
              files: [],
              components: [],
              ephemeral: true,
            })
            .then(async () => {
              const collectedMessage = await awaitMessage(int);
              if (collectedMessage != undefined) {
                setTimeout(
                  async () => await collectedMessage.message.delete(),
                  90
                );
                const text = collectedMessage.content;
                let data = undefined;
                if (week > 0) {
                  data = await getData(week);
                } else {
                  data = getNextSunday().getTime();
                  await createEvent(1, data);
                }
                removeElement(obj);
                add(week, userId, drawName, text, comments, url, int);

                const msgComments =
                  comments != undefined ? `${comments}` : "~~vazio~~";
                let msgFinal =
                  `Veja se todas as informações estão corretas. Caso estejam, clique no botão **enviar**.\n` +
                  `Houve algum erro? Clique em **editar** para corrigir.\n\n` +
                  `Título: ${drawName}\nTipo: ${text}\nComentário: ${msgComments}\nImagem:`;

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

                int
                  .editReply({
                    content: msgFinal,
                    files: [{ attachment: url, name: `${drawName}.png` }],
                    components: [send],
                    ephemeral: true,
                  })
                  .catch(console.log);
              } else {
                int.editReply({
                  content:
                    emojis["error"] +
                    " Você demorou demais para enviar o tipo! Use o comando `/enviar` novamente.",
                  ephemeral: true,
                });
              }
            })
            .catch(console.log);
        });
      } else if (selected == "comment") {
        return await interaction.deferUpdate().then(() => {
          int
            .editReply({
              content: `${emojis["send"]} Digite qual será o novo comentário:`,
              files: [],
              components: [],
              ephemeral: true,
            })
            .then(async () => {
              const collectedMessage = await awaitMessage(int);
              if (collectedMessage != undefined) {
                setTimeout(
                  async () => await collectedMessage.message.delete(),
                  90
                );
                let text = collectedMessage.content;
                let data = undefined;
                if (week > 0) {
                  data = await getData(week);
                } else {
                  data = getNextSunday().getTime();
                  await createEvent(1, data);
                }

                if (text.length > 1000) {
                  text = text.slice(0, 1000);
                }

                removeElement(obj);
                add(week, userId, drawName, type, text, url, int);

                const msgComments =
                  comments != undefined ? `${text}` : "~~vazio~~";
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

                int
                  .editReply({
                    content: msgFinal,
                    files: [{ attachment: url, name: `${drawName}.png` }],
                    components: [send],
                    ephemeral: true,
                  })
                  .catch(console.log);
              } else {
                int.editReply({
                  content:
                    emojis["error"] +
                    " Você demorou demais para enviar o título! Use o comando `/enviar` novamente.",
                  ephemeral: true,
                });
              }
            })
            .catch(console.log);
        });
      } else if (selected == "image") {
        return await interaction.deferUpdate().then(() => {
          int
            .editReply({
              content: `${emojis["send"]} Envie a nova imagem.`,
              files: [],
              components: [],
              ephemeral: true,
            })
            .then(async () => {
              const collectedMessage = await awaitImage(int);
              if (collectedMessage != undefined) {
                setTimeout(
                  async () => await collectedMessage.message.delete(),
                  90
                );
                let text = collectedMessage.url;
                let data = undefined;
                if (week > 0) {
                  data = await getData(week);
                } else {
                  data = getNextSunday().getTime();
                  await createEvent(1, data);
                }

                removeElement(obj);
                add(week, userId, drawName, type, comments, text, int);

                const msgComments =
                  comments != undefined ? `${comments}` : "~~vazio~~";
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

                int
                  .editReply({
                    content: msgFinal,
                    files: [{ attachment: text, name: `${drawName}.png` }],
                    components: [send],
                    ephemeral: true,
                  })
                  .catch(console.log);
              } else {
                int.editReply({
                  content:
                    emojis["error"] +
                    " Você demorou demais para enviar o título! Use o comando `/enviar` novamente.",
                  ephemeral: true,
                });
              }
            })
            .catch(console.log);
        });
      }
    }

    if (customId === "select-roles-main") {
      const registerId = await getter(guildId, "role", "register");
      const rolesId = await getter(guildId, "role", "roles");

      const memberId = await getter(guildId, "role", "member");
      const designerId = await getter(guildId, "role", "designer");
      const readerId = await getter(guildId, "role", "reader");
      const writerId = await getter(guildId, "role", "writer");

      const roleRegister = guild.roles.cache.find(
        (role) => role.id === registerId
      );
      const roleRoles = guild.roles.cache.find((role) => role.id === rolesId);

      const roleMember = guild.roles.cache.find((role) => role.id === memberId);

      let welcome = false;

      if (
        member.roles.cache.get(rolesId) !== undefined &&
        member.roles.cache.get(registerId) !== undefined
      ) {
        await member.roles.remove([roleRegister, roleRoles]);
        await member.roles.add([roleMember]);
        welcome = true;
      }

      let selecteds = [];
      let removeds = [];

      if (values.includes("reader")) {
        const id = readerId;
        const role = guild.roles.cache.find((role) => role.id === id);
        if (role != undefined && member.roles.cache.get(id) == undefined) {
          await member.roles.add(role);
          selecteds.push(id);
        }
      } else if (
        member.roles.cache.get(readerId) !== undefined &&
        !selecteds.includes(readerId)
      ) {
        const role = guild.roles.cache.find((role) => role.id === readerId);
        if (role != undefined) {
          member.roles.remove(role);
          removeds.push(readerId);
        }
      }

      if (values.includes("writer")) {
        const id = writerId;
        const role = guild.roles.cache.find((role) => role.id === id);
        if (role != undefined && member.roles.cache.get(id) == undefined) {
          await member.roles.add(role);
          selecteds.push(id);
        }
      } else if (
        member.roles.cache.get(writerId) !== undefined &&
        !selecteds.includes(writerId)
      ) {
        const role = guild.roles.cache.find((role) => role.id === writerId);
        if (role != undefined) {
          member.roles.remove(role);
          removeds.push(writerId);
        }
      }

      if (values.includes("designer")) {
        const id = designerId;
        const role = guild.roles.cache.find((role) => role.id === id);
        if (role != undefined && member.roles.cache.get(id) == undefined) {
          await member.roles.add(role);
          selecteds.push(id);
        }
      } else if (
        member.roles.cache.get(designerId) !== undefined &&
        !selecteds.includes(designerId)
      ) {
        const role = guild.roles.cache.find((role) => role.id === designerId);
        if (role != undefined) {
          member.roles.remove(role);
          removeds.push(designerId);
        }
      }

      if (selecteds.length && removeds.length) {
        let messageRemoved = "";
        let messageSelected = "";
        let index = 0;
        for (const selectsId of removeds) {
          if (index == 0) messageRemoved += `<@&${selectsId}>`;
          else if (removeds.length == index + 1)
            messageRemoved += ` e <@&${selectsId}>`;
          else messageRemoved += `, <@&${selectsId}>`;
          index++;
        }
        index = 0;
        for (const selectsId of selecteds) {
          if (index == 0) messageSelected += `<@&${selectsId}>`;
          else if (removeds.length == index + 1)
            messageSelected += ` e <@&${selectsId}>`;
          else messageSelected += `, <@&${selectsId}>`;
          index++;
        }
        let agreementRemoved = removeds.length > 1 ? "os cargos" : "o cargo";
        let agreementSelected = selecteds.length > 1 ? "os cargos" : "o cargo";
        await interaction
          .reply({
            content: `Foi removido ${agreementRemoved} ${messageRemoved} da sua conta e adicionado ${agreementSelected} ${messageSelected}`,
            ephemeral: true,
          })
          .catch(console.log);
      } else if (removeds.length) {
        let message = "";
        let index = 0;
        for (const selectsId of removeds) {
          if (index == 0) message += `<@&${selectsId}>`;
          else if (removeds.length == index + 1)
            message += ` e <@&${selectsId}>`;
          else message += `, <@&${selectsId}>`;
          index++;
        }
        let agreement = removeds.length > 1 ? "os cargos" : "o cargo";
        interaction
          .reply({
            content: `Foi removido ${agreement} ${message} da sua conta.`,
            ephemeral: true,
          })
          .catch(console.log);
      } else if (selecteds.length) {
        let message = "";
        let index = 0;
        for (const selectsId of selecteds) {
          if (index == 0) message += `<@&${selectsId}>`;
          else if (selecteds.length == index + 1)
            message += ` e <@&${selectsId}>`;
          else message += `, <@&${selectsId}>`;
          index++;
        }
        let agreement = selecteds.length > 1 ? "os cargos" : "o cargo";
        let messageFinal =
          welcome == true
            ? `Seja bem-vindo ao servidor! Foi adicionado ${agreement} ${message} à sua conta.`
            : `Foi adicionado ${agreement} ${message} à sua conta.`;
        interaction
          .reply({
            content: messageFinal,
            ephemeral: true,
          })
          .catch(console.log);
      } else {
        interaction
          .reply({
            content: `Você já tem os cargos selecionados.`,
            ephemeral: true,
          })
          .catch(console.log);
      }
    }

    if (customId === "select-roles") {
      const readingId = await getter(guildId, "role", "interactive-reading");
      const drawId = await getter(guildId, "role", "draw-week");
      const creativeId = await getter(guildId, "role", "creative");
      const novelClubId = await getter(guildId, "role", "novel-club");

      let selecteds = [];
      let removeds = [];

      const readingRole = guild.roles.cache.find(
        (role) => role.id === readingId
      );
      const drawRole = guild.roles.cache.find((role) => role.id === drawId);
      const novelClubRole = guild.roles.cache.find(
        (role) => role.id === novelClubId
      );
      const creativeRole = guild.roles.cache.find(
        (role) => role.id === creativeId
      );

      if (!values.length) {
        member.roles.remove(readingRole);
        member.roles.remove(drawRole);
        member.roles.remove(creativeRole);
        member.roles.remove(novelClubRole);
        return interaction
          .reply({
            content: `Todos os cargos de anúncio foram retirados.`,
            ephemeral: true,
          })
          .catch(console.log);
      }

      if (values.includes("reading")) {
        if (member.roles.cache.get(readingId) == undefined) {
          member.roles.add(readingRole);
          selecteds.push(readingId);
        }
      } else if (
        member.roles.cache.get(readingId) !== undefined &&
        !selecteds.includes(readingId)
      ) {
        member.roles.remove(readingRole);
        removeds.push(readingId);
      }

      if (values.includes("novel-club")) {
        if (member.roles.cache.get(novelClubId) == undefined) {
          member.roles.add(novelClubRole);
          selecteds.push(novelClubId);
        }
      } else if (
        member.roles.cache.get(novelClubId) !== undefined &&
        !selecteds.includes(novelClubId)
      ) {
        member.roles.remove(novelClubRole);
        removeds.push(novelClubId);
      }

      if (values.includes("draw")) {
        if (member.roles.cache.get(drawId) == undefined) {
          member.roles.add(drawRole);
          selecteds.push(drawId);
        }
      } else if (
        member.roles.cache.get(drawId) !== undefined &&
        !selecteds.includes(drawId)
      ) {
        member.roles.remove(drawRole);
        removeds.push(drawId);
      }

      if (values.includes("creative")) {
        if (member.roles.cache.get(creativeId) == undefined) {
          member.roles.add(creativeRole);
          selecteds.push(creativeId);
        }
      } else if (
        member.roles.cache.get(creativeId) !== undefined &&
        !selecteds.includes(creativeId)
      ) {
        member.roles.remove(creativeRole);
        removeds.push(creativeId);
      }

      if (selecteds.length && removeds.length) {
        let messageRemoved = "";
        let messageSelected = "";
        let index = 0;
        for (const selectsId of removeds) {
          if (index == 0) messageRemoved += `<@&${selectsId}>`;
          else if (removeds.length == index + 1)
            messageRemoved += ` e <@&${selectsId}>`;
          else messageRemoved += `, <@&${selectsId}>`;
          index++;
        }
        index = 0;
        for (const selectsId of selecteds) {
          if (index == 0) messageSelected += `<@&${selectsId}>`;
          else if (removeds.length == index + 1)
            messageSelected += ` e <@&${selectsId}>`;
          else messageSelected += `, <@&${selectsId}>`;
          index++;
        }
        let agreementRemoved = removeds.length > 1 ? "os cargos" : "o cargo";
        let agreementSelected = selecteds.length > 1 ? "os cargos" : "o cargo";
        interaction
          .reply({
            content: `Foi removido ${agreementRemoved} ${messageRemoved} da sua conta e adicionado ${agreementSelected} ${messageSelected}`,
            ephemeral: true,
          })
          .catch(console.log);
      } else if (removeds.length) {
        let message = "";
        let index = 0;
        for (const selectsId of removeds) {
          if (index == 0) message += `<@&${selectsId}>`;
          else if (removeds.length == index + 1)
            message += ` e <@&${selectsId}>`;
          else message += `, <@&${selectsId}>`;
          index++;
        }
        let agreement = removeds.length > 1 ? "os cargos" : "o cargo";
        interaction
          .reply({
            content: `Foi removido ${agreement} ${message} da sua conta.`,
            ephemeral: true,
          })
          .catch(console.log);
      } else if (selecteds.length) {
        let message = "";
        let index = 0;
        for (const selectsId of selecteds) {
          if (index == 0) message += `<@&${selectsId}>`;
          else if (selecteds.length == index + 1)
            message += ` e <@&${selectsId}>`;
          else message += `, <@&${selectsId}>`;
          index++;
        }
        let agreement = selecteds.length > 1 ? "os cargos" : "o cargo";
        interaction
          .reply({
            content: `Foi adicionado ${agreement} ${message} à sua conta.`,
            ephemeral: true,
          })
          .catch(console.log);
      } else {
        interaction
          .reply({
            content: `Você já tem os cargos selecionados.`,
            ephemeral: true,
          })
          .catch(console.log);
      }
    }
  },
};
