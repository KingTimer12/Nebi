const { getter } = require("../utils/firebaseGuildApi");

module.exports = {
  name: "Select Menu",
  event: "interactionCreate",
  once: false,

  async createEvent(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    const { member, guildId, guild, values, customId } = interaction;

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
        await interaction.reply({
          content: `Foi removido ${agreementRemoved} ${messageRemoved} da sua conta e adicionado ${agreementSelected} ${messageSelected}`,
          ephemeral: true,
        }).catch(err => {});
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
        await interaction.reply({
          content: `Foi removido ${agreement} ${message} da sua conta.`,
          ephemeral: true,
        }).catch(err => {});
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
        await interaction.reply({
          content: messageFinal,
          ephemeral: true,
        }).catch(err => {});
      } else {
        await interaction.reply({
          content: `Você já tem os cargos selecionados.`,
          ephemeral: true,
        }).catch(err => {});
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
        return interaction.reply({
          content: `Todos os cargos de anúncio foram retirados.`,
          ephemeral: true,
        }).catch(err => {});
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
        interaction.reply({
          content: `Foi removido ${agreementRemoved} ${messageRemoved} da sua conta e adicionado ${agreementSelected} ${messageSelected}`,
          ephemeral: true,
        }).catch(err => {});
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
        interaction.reply({
          content: `Foi removido ${agreement} ${message} da sua conta.`,
          ephemeral: true,
        }).catch(err => {});
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
        interaction.reply({
          content: `Foi adicionado ${agreement} ${message} à sua conta.`,
          ephemeral: true,
        }).catch(err => {});
      } else {
        interaction.reply({
          content: `Você já tem os cargos selecionados.`,
          ephemeral: true,
        }).catch(err => {});
      }
    }
  },
};
