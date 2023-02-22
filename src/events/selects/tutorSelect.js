const { ButtonStyle } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { getRole, getChannel } = require("../../database/manager/guildManager");
const { emojis } = require("../../utils/emotes.json");
const { getTutores } = require("../../utils/googleApi/rankApi");

module.exports = {
  customId: "select-tutor",
  async execute(interaction, client) {
    const { guild, values, channel } = interaction;
    const int = interaction;

    let tutor = undefined;

    return await interaction
      .deferReply({ ephemeral: true })
      .then(async () => {
        const targetMember = guild.members.cache.find(
          (member) => member.user.tag.replace("#", "") == channel.name
        );
    
        const forumId = await getChannel(guild, { channelName: "forum" });
        if (forumId == undefined) return;
    
        const forumChannel = guild.channels.cache.find((chn) => chn.id === forumId);
    
        const studentId = await getRole(guild, { roleName: "student" });
        if (studentId == undefined) return;
        let studentRole = guild.roles.cache.find((role) => role.id == studentId);
        const hasStudent = targetMember.roles.cache.find(
          (role) => role == studentRole
        );
    
        if (hasStudent) {
          return await interaction
            .reply({
              content: `${emojis["error"]} <@${targetMember.id}> já faz parte da tutoria.`,
              ephemeral: true,
            })
            .catch(() => {});
        }

        targetMember.roles.add(studentRole).catch(console.error);

        const tutores = await getTutores(429915779);
        for (const row of tutores) {
          if (values == row.tutorId) {
            tutor = row.tutor;
            let role = guild.roles.cache.find((role) => role.id == row.roleId);
            await targetMember.roles.add(role).catch(() => {});
            break;
          }
        }

        if (!tutor) {
          return await interaction.reply({
            content: `${emojis["error"]} <@${values}> não é um tutor.`,
            ephemeral: true,
          });
        }

        //Remover a Classe ? e a possibilidade de outras classes.
        for (const role of targetMember.roles.cache.values()) {
          if (role.name.includes("Classe") && !role.name.includes("F")) {
            targetMember.roles.remove(role).catch(() => {});
          }
        }

        //Pegar o id da classe F que está salva no banco de dados
        const classFId = await getRole(guild, { roleName: "classF" });
        if (classFId == undefined) return;
        let roleClassF = guild.roles.cache.find((role) => role.id == classFId);
        await targetMember.roles.add(roleClassF);

        const close = forumChannel.availableTags.find(
          (r) => r.name == "Fechado"
        );
        if (!close)
          return await interaction
            .reply({
              content: `Tag Fechado não encontrada no fórum!`,
              ephemeral: true,
            })
            .catch(() => {});
        channel.setAppliedTags([close.id]);

        //Feature pro futuro
        /*const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`accepted`)
            .setEmoji({ id: "1051884168977584139", name: "ready" })
            .setLabel(`Aprovado!`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Success)
        );

        console.log(channel.lastMessage)

        await channel.lastMessage.edit({
          components: [row],
        }).catch(console.error);*/

        await int
          .editReply({
            content: `${emojis["ready"]} <@${targetMember.id}> foi adicionado à tutoria!`,
            ephemeral: true,
          })
          .catch(console.error);
      })
      .catch(console.error);
  },
};
