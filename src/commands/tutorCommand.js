const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {
  addTutorandoRow,
  addDadoRow,
  updateDadosTutorRow,
  getTutores,
  currentTutor,
} = require("../utils/googleApi/rankApi");
require("dotenv").config();
const { emojis } = require("../utils/emotes.json");
const { getter } = require("../utils/firebase/firebaseGuildApi");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tutoria")
    .setDescription("Comando da tutoria")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("adicionar")
        .setDescription("Adicionar um novo tutorando.")
        .addUserOption((option) =>
          option
            .setName("tutorando")
            .setDescription("O user do novo tutorando. Pode usar o id.")
            .setRequired(true)
        )
        .addStringOption((option) =>
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
        .addStringOption((option) =>
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
    const { options, member, channel, guild } = interaction;
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
      tutor = options.get("tutor").value;
    } else {
      tutor = "SemTutor";
    }

    const genericId = await getter(guild.id, "role", "student");
    if (genericId == undefined) return;
    let studentRole = guild.roles.cache.find((role) => role.id == genericId);

    switch (subcommand.name) {
      case "adicionar":
        interaction.deferReply({ ephemeral: true }).then(async () => {
          targetMember.roles.add(studentRole);

          await addTutorandoRow(755009417, userIdTarget, username, nickname);
          await addDadoRow(1365207529, targetMember.user, tutor);

          const tutores = await getTutores(429915779);
          for (const row of tutores) {
            if (row.tutor == tutor) {
              let role = guild.roles.cache.find(
                (role) => role.id == row.roleId
              );
              targetMember.roles.add(role);
              break;
            }
          }

          for (const role of targetMember.roles.cache.values()) {
            if (role.name.includes("Classe") && !role.name.includes("F")) {
              targetMember.roles.remove(role);
            }
          }

          const classFId = await getter(guild.id, "role", "classF");
          if (classFId == undefined) return;
          let roleClassF = guild.roles.cache.find(
            (role) => role.id == classFId
          );
          targetMember.roles.add(roleClassF);

          int.editReply({
            content: `${emojis["ready"]} <@${userIdTarget}> foi adicionado à tutoria!`,
            ephemeral: true,
          });
        });

        break;
      case "alterar":
        const hasStudent = targetMember.roles.cache.find(
          (role) => role == studentRole
        );

        if (!hasStudent) {
          return interaction.reply({
            content: `${emojis["error"]} <@${userIdTarget}> não faz parte da tutoria!`,
            ephemeral: true,
          });
        }

        interaction.deferReply({ ephemeral: true }).then(async () => {
          const tutores = await getTutores(429915779);
          for (const row of tutores) {
            let role = targetMember.roles.cache.find(
              (role) => role.id == row.roleId
            );
            if (role) {
              targetMember.roles.remove(role);
            }
            if (!role && row.tutor == tutor) {
              role = guild.roles.cache.find((role) => role.id == row.roleId);
              targetMember.roles.add(role);
              break;
            }
          }

          await updateDadosTutorRow(1365207529, targetMember.user, tutor);

          int.editReply({
            content: `${emojis["ready"]} O tutor de <@${userIdTarget}> foi alterado para ${tutor}!`,
            ephemeral: true,
          });
        });

        break;
      case "remover":
        interaction.deferReply({ ephemeral: true }).then(async () => {
          const tutores = await getTutores(429915779);
          for (const row of tutores) {
            const role = targetMember.roles.cache.find(
              (role) => role.id == row.roleId
            );
            if (role) {
              targetMember.roles.remove(role);
              break;
            }
          }

          for (const role of targetMember.roles.cache.values()) {
            if (role.name.includes("Classe") && !role.name.includes("?")) {
              targetMember.roles.remove(role);
            }
          }

          await updateDadosTutorRow(1365207529, username, "Inativo");

          targetMember.roles.remove(studentRole);

          const classInId = await getter(guild.id, "role", "class?");
          if (classInId == undefined) return;
          let roleClassIn = guild.roles.cache.find(
            (role) => role.id == classInId
          );
          targetMember.roles.add(roleClassIn);

          int.editReply({
            content: `${emojis["ready"]} <@${userIdTarget}> foi retirado da tutoria!`,
            ephemeral: true,
          });
        });

        break;
    }
  },
};
