const { emojis } = require("../../utils/emotes.json");
const { getter } = require("../../utils/firebase/firebaseGuildApi");

const addSelectedRole = (guild, member, id) => {
  const role = guild.roles.cache.find((role) => role.id === id);
  if (role != undefined && member.roles.cache.get(id) == undefined) {
    member.roles.add(role).catch(console.log);
    return id;
  }
  return undefined;
};

const removeSelectedRole = (guild, member, id) => {
  const role = guild.roles.cache.find((role) => role.id === id);
  if (role != undefined && member.roles.cache.get(id) != undefined) {
    member.roles.remove(role).catch(console.log);
    return id;
  }
  return undefined;
};

const messageLoop = (index, selectedId, message, array) => {
  if (index == 0) message += `<@&${selectedId}>`;
  else if (array.length == index + 1) message += ` e <@&${selectedId}>`;
  else message += `, <@&${selectedId}>`;
  return message;
};

const messageFinalRole = (selecteds, removeds, welcome) => {
  let messageFinal = "";

  if (selecteds.length && removeds.length) {
    let messageRemoved = "";
    let messageSelected = "";
    let index = 0;
    for (const selectsId of removeds) {
      messageRemoved = messageLoop(index, selectsId, messageRemoved, removeds);
      index++;
    }
    index = 0;
    for (const selectsId of selecteds) {
      messageSelected = messageLoop(index, selectsId, messageSelected, selecteds);
      index++;
    }
    let agreementRemoved = removeds.length > 1 ? "os cargos" : "o cargo";
    let agreementSelected = selecteds.length > 1 ? "os cargos" : "o cargo";
    messageFinal = `Foi removido ${agreementRemoved} ${messageRemoved} da sua conta e adicionado ${agreementSelected} ${messageSelected}`;
  } else if (removeds.length) {
    let message = "";
    let index = 0;
    for (const selectsId of removeds) {
      message = messageLoop(index, selectsId, message, removeds);
      index++;
    }
    let agreement = removeds.length > 1 ? "os cargos" : "o cargo";
    messageFinal = `Foi removido ${agreement} ${message} da sua conta.`;
  } else if (selecteds.length) {
    let message = "";
    let index = 0;
    for (const selectsId of selecteds) {
      message = messageLoop(index, selectsId, message, selecteds);
      index++;
    }
    let agreement = selecteds.length > 1 ? "os cargos" : "o cargo";
    messageFinal =
      welcome == true
        ? `Seja bem-vindo ao servidor! Foi adicionado ${agreement} ${message} à sua conta.`
        : `Foi adicionado ${agreement} ${message} à sua conta.`;
  } else {
    messageFinal = `Você já tem os cargos selecionados.`;
  }

  return messageFinal;
};

module.exports = {
  customId: "select-roles-main",
  async execute(interaction, client) {
    const { member, guildId, guild, values, user } = interaction;

    const registerId = await getter(guildId, "role", "register");
    const rolesId = await getter(guildId, "role", "roles");

    if (registerId == undefined && rolesId == undefined) return;

    const memberId = await getter(guildId, "role", "member");
    if (memberId == undefined) return;

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

    const valuesList = [
      "reader",
      "reviser",
      "writer",
      "translate",
      "screenwriter",
      "designer",
    ];

    for (const value of valuesList) {
      const roleId = await getter(guild.id, "role", value);
      if (roleId == undefined) continue;
      if (values.includes(value)) {
        const id = addSelectedRole(guild, member, roleId);
        if (id != undefined) selecteds.push(id);
      } else if (
        member.roles.cache.get(roleId) !== undefined &&
        !selecteds.includes(roleId)
      ) {
        const id = removeSelectedRole(guild, member, roleId);
        if (id != undefined) removeds.push(id);
      }
    }

    interaction
      .reply({
        content: messageFinalRole(selecteds, removeds, welcome),
        ephemeral: true,
      })
      .catch(console.log);
  },
};
