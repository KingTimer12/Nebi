const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {
  addTutorandoRow,
  addDadoRow,
  updateDadosTutorRow,
  getTutores,
} = require("../utils/googleApi/rankApi");
require("dotenv").config();
const { emojis } = require("../utils/emotes.json");
const { getter } = require("../utils/firebase/firebaseGuildApi");
const { getRole } = require("../database/manager/guildManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tutoria")
    .setDescription("Comando da tutoria")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("adicionar")
        .setDescription("Adicione um novo tutorando.")
        .addUserOption((option) =>
          option
            .setName("tutorando")
            .setDescription("O user do novo tutorando. Pode usar o id.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option.setName("tutor").setDescription("O tutor do novo tutorando.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("alterar")
        .setDescription("Altere o tutor de um tutorando.")
        .addUserOption((option) =>
          option
            .setName("tutorando")
            .setDescription("O user do tutorando. Pode usar o id.")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option.setName("tutor").setDescription("O novo tutor do tutorando.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remover")
        .setDescription("Remova o tutorando da tutoria.")
        .addUserOption((option) =>
          option
            .setName("tutorando")
            .setDescription("O user do tutorando. Pode usar o id.")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads),

  dev: false,

  async execute(interaction) {
    const { options, guild } = interaction;
    const int = interaction;

    const subcommand = options.data[0];

    const userIdTarget = options.get("tutorando").value;

    const targetMember = guild.members.cache.find(
      (member) => member.id == userIdTarget
    );
    const username = targetMember.user.tag;

    let nickname = targetMember.nickname;
    if (!nickname) {
      nickname = targetMember.user.username;
    }

    let tutor = options.get("tutor");
    if (tutor) {
      let tutorId = options.get("tutor").value;
      let founded = false
      const tutores = await getTutores(429915779)
      for (const row of tutores) {
        if (tutorId == row.tutorId) {
          tutor = row.tutor
          founded = true
          break
        }
      }
      if (!founded) {
        return await interaction.reply({
          content: `${emojis["error"]} <@${tutorId}> não é um tutor.`,
          ephemeral: true,
        })
      }
    } else {
      tutor = "SemTutor";
    }

    const studentId = await getRole(guild, {roleName:'student'})
    if (studentId == undefined) return;
    let studentRole = guild.roles.cache.find((role) => role.id == studentId);
    const hasStudent = targetMember.roles.cache.find((role) => role == studentRole);

    switch (subcommand.name) {
      case "adicionar":

        if (hasStudent) {
          return await interaction.reply({
            content: `${emojis["error"]} <@${userIdTarget}> já faz parte da tutoria.`,
            ephemeral: true,
          }).catch(() => {});
        }

        await interaction.deferReply({ ephemeral: true }).then(async () => {

          //Adicionando o cargo tutorando.
          await targetMember.roles.add(studentRole).catch(() => {});

          //Adicionando as informações na planilha.
          await addTutorandoRow(755009417, userIdTarget, username, nickname);
          await addDadoRow(1365207529, targetMember.user, tutor);

          //Adicionando o cargo do tutor.
          const tutores = await getTutores(429915779);
          for (const row of tutores) {
            if (row.tutor == tutor) {
              let role = guild.roles.cache.find(
                (role) => role.id == row.roleId
              );
              await targetMember.roles.add(role).catch(() => {});
              break;
            }
          }

          //Remover a Classe ? e a possibilidade de outras classes.
          for (const role of targetMember.roles.cache.values()) {
            if (role.name.includes("Classe") && !role.name.includes("F")) {
              await targetMember.roles.remove(role).catch(() => {});
            }
          }

          //Pegar o id da classe F que está salva no banco de dados
          const classFId = await getRole(guild, {roleName:'classF'})
          if (classFId == undefined) return;
          let roleClassF = guild.roles.cache.find(
            (role) => role.id == classFId
          );
          await targetMember.roles.add(roleClassF);

          await int.editReply({
            content: `${emojis["ready"]} <@${userIdTarget}> foi adicionado à tutoria!`,
            ephemeral: true,
          }).catch(() => {});

        }).catch(() => {});

        break;
      case "alterar":
        if (!hasStudent) {
          return await interaction.reply({
            content: `${emojis["error"]} <@${userIdTarget}> não faz parte da tutoria.`,
            ephemeral: true,
          }).catch(() => {});
        }

        await interaction.deferReply({ ephemeral: true }).then(async () => {
          //Mudando o cargo do tutor.
          const tutores = await getTutores(429915779);
          for (const row of tutores) {
            let role = targetMember.roles.cache.find(
              (role) => role.id == row.roleId
            );
            if (role && row.tutor != tutor) {
              await targetMember.roles.remove(role).catch(() => {});
            }
            if (!role && row.tutor == tutor) {
              role = guild.roles.cache.find((role) => role.id == row.roleId);
              targetMember.roles.add(role).catch(() => {});
            }
          }

          //Atualizando na planilha
          await updateDadosTutorRow(1365207529, targetMember.user, tutor);

          await int.editReply({
            content: `${emojis["ready"]} O tutor de <@${userIdTarget}> foi alterado para ${tutor}!`,
            ephemeral: true,
          }).catch(() => {});

        }).catch(() => {});

        break;
      case "remover":
        if (!hasStudent) {
          return await interaction.reply({
            content: `${emojis["error"]} <@${userIdTarget}> não faz parte da tutoria.`,
            ephemeral: true,
          }).catch(() => {});
        }

        await interaction.deferReply({ ephemeral: true }).then(async () => {

          //Removendo o cargo do tutor.
          const tutores = await getTutores(429915779);
          for (const row of tutores) {
            const role = targetMember.roles.cache.find(
              (role) => role.id == row.roleId
            );
            if (role) {
              await targetMember.roles.remove(role).catch(() => {});
              break;
            }
          }

          //Removendo todos os cargos classe.
          for (const role of targetMember.roles.cache.values()) {
            if (role.name.includes("Classe") && !role.name.includes("?")) {
              await targetMember.roles.remove(role).catch(() => {});
            }
          }

          //Atualizando na planilha.
          await updateDadosTutorRow(1365207529, targetMember.user, "Inativo");

          //Removendo o cargo tutorando.
          await targetMember.roles.remove(studentRole).catch(() => {});

          //Adicionando a Classe ?
          const classInId = await getRole(guild, {roleName:'class?'});
          if (classInId == undefined) return;
          let roleClassIn = guild.roles.cache.find(
            (role) => role.id == classInId
          );
          await targetMember.roles.add(roleClassIn).catch(() => {});

          await int.editReply({
            content: `${emojis["ready"]} <@${userIdTarget}> foi retirado da tutoria!`,
            ephemeral: true,
          }).catch(() => {});
        });

        break;
    }
  },
};
