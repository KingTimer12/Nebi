const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addTutorandoRow, addDadoRow } = require("../utils/googleApi/rankApi");
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
    ).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  dev: false,

  async execute(interaction) {
    const { options, member, channel, guild } = interaction;

    const subcommand = options.data[0];

    switch (subcommand.name) {
      case "adicionar":
        const userIdTarget = options.get("tutorando").value;

        const targetMember = guild.members.cache.find(
          (member) => member.id == userIdTarget
        );
        const username = targetMember.user.username;

        let nickname = targetMember.nickname;
        if (!nickname) {
          nickname = username;
        }

        let tutor = options.get("tutor");
        if (tutor) {
          tutor = options.get("tutor").value;
        } else {
          tutor = "SemTutor"
        }

        await addTutorandoRow(755009417, userIdTarget, username, nickname);
        //await addDadoRow(1365207529, username, tutor)

        const genericId = await getter(guild.id, "role", "student");
        if (genericId == undefined) return;
        let role = guild.roles.cache.find((role) => role.id == genericId);
        targetMember.roles.add(role);

        interaction.reply({
          content: `${emojis["ready"]} <@${userIdTarget}> foi adicionado à tutoria!`,
          ephemeral: true,
        });

        break;
    }
  },
};
