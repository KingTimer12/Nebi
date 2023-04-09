const { getRole, addMember } = require("../../database/manager/guildManager");
const { emojis } = require("../../utils/emotes.json");
const { getter } = require("../../utils/firebase/firebaseGuildApi");
const { toMoment } = require("../../utils/timerApi");

const addSelectedRole = (guild, member, id) => {
  const role = guild.roles.cache.find((role) => role.id === id);
  if (role != undefined && member.roles.cache.get(id) == undefined) {
    return id;
  }
  return undefined;
};

const removeSelectedRole = (guild, member, id) => {
  const role = guild.roles.cache.find((role) => role.id === id);
  if (role != undefined && member.roles.cache.get(id) != undefined) {
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
    messageFinal = `${emojis["ready"]} Foi removido ${agreementRemoved} ${messageRemoved} da sua conta e adicionado ${agreementSelected} ${messageSelected}`;
  } else if (removeds.length) {
    let message = "";
    let index = 0;
    for (const selectsId of removeds) {
      message = messageLoop(index, selectsId, message, removeds);
      index++;
    }
    let agreement = removeds.length > 1 ? "os cargos" : "o cargo";
    messageFinal = `${emojis["ready"]} Foi removido ${agreement} ${message} da sua conta.`;
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
        : `${emojis["ready"]} Foi adicionado ${agreement} ${message} à sua conta.`;
  } else {
    messageFinal = `${emojis["error"]} Você já tem os cargos selecionados.`;
  }

  return messageFinal;
};

module.exports = {
  customId: "select-roles-main",
  async execute(interaction) {
    const { member, guild, values } = interaction;

    const registerId = await getRole(guild, {roleName:'register'})
    const rolesId = await getRole(guild, {roleName:'roles'})
    const rookieId = await getRole(guild, {roleName:'rookie'})

    if (registerId == undefined && rolesId == undefined && rookieId == undefined) return;

    const roleRegister = guild.roles.cache.find(
      (role) => role.id === registerId
    );
    const roleRoles = guild.roles.cache.find((role) => role.id === rolesId);

    const roleRookie = guild.roles.cache.find((role) => role.id === rookieId);

    let welcome = false;

    if (
      member.roles.cache.get(rolesId) !== undefined &&
      member.roles.cache.get(registerId) !== undefined
    ) {
      await member.roles.remove([roleRegister, roleRoles]).catch(console.error);
      await member.roles.add([roleRookie]).catch(console.error);
      await addMember(guild, {userId: member.id, timestamp: toMoment(Date.now()).day(toMoment(Date.now()).day()+7)})
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
      const roleId = await getRole(guild, {roleName:value})
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

    if (selecteds.length) {
      const result = selecteds.map(id => guild.roles.cache.find((role) => role.id === id))
      await member.roles.add(result).catch(console.error);
    }
    if (removeds.length) {
      const result = removeds.map(id => guild.roles.cache.find((role) => role.id === id))
      await member.roles.remove(result).catch(console.error);
    }

    return await interaction
      .reply({
        content: messageFinalRole(selecteds, removeds, welcome),
        ephemeral: true,
      })
      .catch(console.error);
  },
};
