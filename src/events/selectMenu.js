const { getter } = require("../utils/firebaseGuildApi");

module.exports = {
  async createEvent(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    const { member, guildId, guild, values, customId } = interaction;
    const selected = values[0];

    if (customId === "select-roles-main") {
      const registerId = await getter(guildId, "role", "register");
      const rolesId = await getter(guildId, "role", "roles");
      const memberId = await getter(guildId, "role", "member");
      const designerId = await getter(guildId, "role", "designer");

      const roleRegister = guild.roles.cache.find(
        (role) => role.id === registerId
      );

      const roleRoles = guild.roles.cache.find((role) => role.id === rolesId);

      const roleMember = guild.roles.cache.find((role) => role.id === memberId);

      await member.roles.remove([roleRegister, roleRoles]);
      await member.roles.add([roleMember]);
      if (selected === "designer") {
        const roleDesigner = guild.roles.cache.find(
          (role) => role.id === designerId
        );
        await member.roles.add(roleDesigner);
        interaction.reply({
          content: `Seja bem-vindo ao servidor!`,
          ephemeral: true,
        });
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
      const novelClubRole = guild.roles.cache.find((role) => role.id === novelClubId);
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
        });
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

      if (removeds.length) {
        let message = "";
        let index = 0;
        for (const selectsId of removeds) {
          if (index == 0) message += `<@&${selectsId}>`;
          else if (removeds.length == index+1)
            message += ` e <@&${selectsId}>`;
          else message += `, <@&${selectsId}>`;
          index++;
        }
        let agreement = removeds.length > 1 ? "os cargos" : "o cargo";
        interaction.reply({
          content: `Foi removido ${agreement} ${message} da sua conta.`,
          ephemeral: true,
        });
      }
      if (selecteds.length) {
        let message = "";
        let index = 0;
        for (const selectsId of selecteds) {
          if (index == 0) message += `<@&${selectsId}>`;
          else if (selecteds.length == index+1) message += ` e <@&${selectsId}>`;
          else message += `, <@&${selectsId}>`;
          index++;
        }
        let agreement = selecteds.length > 1 ? "os cargos" : "o cargo";
        interaction.reply({
          content: `Foi adicionado ${agreement} ${message} à sua conta.`,
          ephemeral: true,
        });
      }
    }
  },
};
