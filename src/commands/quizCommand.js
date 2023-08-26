const {
  SlashCommandBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} = require("discord.js");
require("dotenv").config();

const quizConfig = require("../config/quiz.json");

const awaitMessageUpdate = async (
  interaction,
  filter,
  { embeds, rows },
  time = 600_000
) => {
  let response = await interaction
    .editReply({ embeds: [embeds], components: [rows] })
    .catch(console.error);
  if (response) {
    let messageResponseComponent = await response
      .awaitMessageComponent({
        filter,
        time,
        errors: ["time"],
      })
      .catch(console.error);

    let responseCache = "";
    await messageResponseComponent.update({ fetchReply: true });
    if (messageResponseComponent instanceof StringSelectMenuInteraction) {
      const value = messageResponseComponent.values[0];
      responseCache = value;
    } else {
      const value = messageResponseComponent.customId;
      responseCache = value;
    }

    return responseCache;
  }
  return undefined;
};

const getMaxNumber = (maxDefault, mode) => {
  let maxNumber = maxDefault;
  switch (mode) {
    case "hard":
      maxNumber = maxNumber >= 50 ? 50 : maxNumber;
      break;
    case "desafio":
      maxNumber = maxNumber >= 100 ? 100 : maxNumber;
      break;
    default:
      maxNumber = maxNumber >= 25 ? 25 : maxNumber;
      break;
  }
  return maxNumber;
};

const awaitMessageCreate = async (
  interaction,
  filter,
  embeds,
  rows,
  time = 600_000
) => {
  let response = await interaction
    .reply({ embeds: [embeds], components: [rows], ephemeral: true })
    .catch(console.error);
  if (response) {
    let messageResponseComponent = await response
      .awaitMessageComponent({
        filter,
        time,
        errors: ["time"],
      })
      .catch(console.error);
    await messageResponseComponent.update({ fetchReply: true });
    return messageResponseComponent;
  }
  return undefined;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const startQuiz = async (interaction, clazz, mode) => {
  let clazzId = "";
  let modeId = "";
  switch (clazz) {
    case "class-F":
      clazzId = "cf";
      break;
    case "class-E":
      clazzId = "ce";
      break;
    case "class-D":
      clazzId = "cd";
      break;
    default:
      clazzId = "c?";
      break;
  }
  switch (mode) {
    case "hard":
      modeId = "H";
      break;
    case "desafio":
      modeId = "D";
      break;
    default:
      modeId = "N";
      break;
  }

  let quiz = [];
  if (clazzId != "c?") {
    clazzId = clazzId + modeId;
    quiz = quizConfig.filter((q) => q.id.split("-")[0] == clazzId);
  } else {
    quiz = quizConfig.filter((q) => q.id.slice(-1) == modeId);
  }

  const answers = [];
  let questionNumber = 0;
  const questionMaxNumber = getMaxNumber(quiz.length, mode);

  const questions = [];

  while (questionNumber < questionMaxNumber) {
    const index = Math.floor(Math.random() * quiz.length);
    const question = quiz[index];
    if (!question) continue;
    if (questions.includes(question.id)) continue;
    questions.push(question.id);

    const fields = [];
    const letters = ["A", "B", "C", "D", "E"];
    const ids = [];
    let letterIndex = 0;
    while (true) {
      if (letterIndex >= 5) {
        break;
      }
      const answerIndex = Math.floor(Math.random() * question.answers.length);
      const answer = question.answers[answerIndex];
      if (ids.includes(answer.id)) {
        continue;
      }
      fields.push({
        name: letters[letterIndex],
        value: answer.answer,
      });
      ids.push(answer.id);
      letterIndex++;
    }

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`item-${ids[0]}`)
        .setLabel("A")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`item-${ids[1]}`)
        .setLabel("B")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`item-${ids[2]}`)
        .setLabel("C")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`item-${ids[3]}`)
        .setLabel("D")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`item-${ids[4]}`)
        .setLabel("E")
        .setStyle(ButtonStyle.Secondary)
    );

    let levelName = "";
    switch (question.level) {
      case "dificil":
        levelName = "Difícil";
        break;
      case "desafio":
        levelName = "Desafio";
        break;
      default:
        levelName = "Fácil";
        break;
    }

    const barArray = [];
    for (let i = 0; i < questionMaxNumber; i++) {
      if (answers[i]) {
        if (answers[i].correct) {
          barArray.push("🟩");
          continue;
        }
        if (!answers[i].correct) {
          barArray.push("🟥");
          continue;
        }
      }
      barArray.push("⬛");
    }
    let description = `\`${barArray.join(
      ""
    )}\`\nDificuldade: **${levelName}**\n\nMarque a opção CORRETA:\n`;
    for (const field of fields) {
      description += `\n**Letra ${field.name}**: _${field.value}_`;
    }

    const embed = new EmbedBuilder()
      .setColor("#2273D6")
      .setTitle(question.question)
      .setDescription(description)
      .setTimestamp();

    const filter = (interaction) =>
      interaction.customId.split("-")[0] === "item";
    const response = await awaitMessageUpdate(interaction, filter, {
      embeds: embed,
      rows: row,
    });

    if (!response) {
      continue;
    }

    const answerId = response.split("-")[1];
    answers.push({
      questionId: question.id,
      answerId,
      correct: question.correct == answerId,
    });

    const components = [];
    let indexL = 0;
    for (const id of ids) {
      if (id == question.correct) {
        components.push(
          new ButtonBuilder()
            .setCustomId(`item${id}`)
            .setLabel(letters[indexL])
            .setDisabled(true)
            .setStyle(ButtonStyle.Success)
        );
        indexL++;
        continue;
      }
      if (id == answerId) {
        components.push(
          new ButtonBuilder()
            .setCustomId(`item${id}`)
            .setLabel(letters[indexL])
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
        );
        indexL++;
        continue;
      }
      components.push(
        new ButtonBuilder()
          .setCustomId(`item${id}`)
          .setLabel(letters[indexL])
          .setDisabled(true)
          .setStyle(ButtonStyle.Danger)
      );
      indexL++;
    }
    row = new ActionRowBuilder().addComponents(components);
    await interaction
      .editReply({
        components: [row],
        ephemeral: true,
      })
      .catch(console.error);
    sleep(5 * 1000);
    questionNumber++;
  }

  return answers;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("Comando quiz.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("resolver")
        .setDescription("Resolva várias perguntas envolvendo as classes F a D.")
    ),

  dev: true,

  async execute(interaction) {
    const { options, user } = interaction;
    const subcommand = options.data[0];
    const userId = user.id;

    switch (subcommand.name) {
      case "resolver":
        let embed = new EmbedBuilder()
          .setColor("#2273D6")
          .setDescription(
            "Teste seus conhecimentos! Leia com atenção as instruções:\n\nSe você for da tutoria, poderá selecionar a classe que virá nas perguntas e dessa forma evoluir o nível das perguntas junto com você. Caso não faça parte, estará disponível somente uma opção.\n\nOs botões abaixo representam as classes e a `?` será uma classe diferente para cada pergunta."
          )
          .setTimestamp();

        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("class-F")
            .setLabel("Classe F")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("class-E")
            .setLabel("Classe E")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("class-D")
            .setLabel("Classe D")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("class-?")
            .setLabel("?")
            .setStyle(ButtonStyle.Success)
        );

        let filter = (interaction) =>
          interaction.customId.split("-")[0] === "class";
        let messageResponseComponent = await awaitMessageCreate(
          interaction,
          filter,
          embed,
          row
        );

        if (!messageResponseComponent) {
          return await interaction
            .editReply({
              content: "Demorou demais para dar uma resposta.",
              embeds: [],
              components: [],
              ephemeral: true,
            })
            .catch(console.error);
        }

        const clazz = messageResponseComponent.customId;

        embed = new EmbedBuilder()
          .setColor("#2273D6")
          .setTitle("Escolha a dificuldade.")
          .setDescription(
            "Cada modo tem diferenças na quantidade de perguntas e no tempo para cada pergunta. Abaixo estará a diferença para cada modo.\n\n**O modo desafio se torna possível após acertar 40 perguntas no modo difícil.**"
          )
          .addFields(
            {
              name: "Normal",
              value: "Terá 25 perguntas, \nsem tempo limite.",
              inline: true,
            },
            {
              name: "Difícil",
              value: "Terá 50 perguntas, \n2 minutos para \ncada pergunta.",
              inline: true,
            },
            {
              name: "Desafio",
              value: "Terá 100 perguntas, \n1 minuto para \ncada pergunta.",
              inline: true,
            }
          )
          .setTimestamp();

        let array = [
          {
            label: "Normal",
            value: "normal",
          },
          {
            label: "Difícil",
            value: "hard",
          },
        ];

        //TODO: Verificar se ele tem completado o mínimo para o modo desafio.

        row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("select-mode")
            .setPlaceholder("Selecione o modo!")
            .addOptions(array)
        );

        filter = (interaction) => interaction.customId === "select-mode";

        const responseCache = await awaitMessageUpdate(interaction, filter, {
          embeds: embed,
          rows: row,
        });

        if (responseCache) {
          const start = Date.now();
          const answers = await startQuiz(interaction, clazz, responseCache);
          if (!answers) return;
          const end = Date.now();
          const duration = end - start;
          const durInSec = Math.floor(duration / 1000);
          const hours = Math.floor(durInSec / 3600);
          const minutes = Math.floor((durInSec % 3600) / 60);
          const seconds = durInSec % 60;

          const corrects = answers.filter((a) => a.correct).length;

          const percent = Math.floor((corrects / answers.length) * 100);
          let messageFinal = "";
          if (percent == 100) {
            messageFinal = "Perfeito! Nunca houve alguém tão bom assim.";
          } else if (percent > 80 && percent < 100) {
            messageFinal = "Incrível! Não foi perfeito, mas foi esplêndido.";
          } else if (percent > 50 && percent <= 80) {
            messageFinal = "Bom, muito para melhorar ainda.";
          } else if (percent > 20 && percent <= 50) {
            messageFinal = "Nossa, você estudou algo?";
          } else if (percent <= 20) {
            messageFinal = "Nt. Nem tentou.";
          }

          let messageNext = ""
          switch (responseCache) {
            case "hard":
              if (percent > 80) {
                messageNext = "Que tal um verdadeiro DESAFIO?\n**Desbloqueado modo desafio. Boa sorte!**"
              } else {
                messageNext = "Tem que melhorar antes de um desafio de verdade."
              }
              break;
            default:
              messageNext = "No normal até minha avó. Que tal aumentar o nível?"
              break;
          }

          embed = new EmbedBuilder()
            .setColor("#2273D6")
            .setTitle(messageFinal)
            .setDescription(
              `Você terminou o quiz, meus parabéns!\n\n> Estatísticas:\n\n\`\`\`\nAcertos: ${corrects}/${
                answers.length
              } (${percent}%)\nDuração: ${minutes > 0 ? `${minutes}min ` : ""}${
                seconds > 0 ? `${seconds}s` : ""
              }\`\`\`\n${messageNext}`
            )
            .setTimestamp();
          
          interaction.editReply({embeds: [embed], components: []})
          //TODO: Salvar informações
        }

        break;
    }
  },
};
