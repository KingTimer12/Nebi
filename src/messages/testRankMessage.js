const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const redHex = "#e91a25";

const firstRankMessages = async (channel) => {
  const embedIntro = new EmbedBuilder()
    .setColor(redHex)
    .setTitle("Guia de Tutoria da Novel Brasil")
    .setDescription(
      "Essa é uma pequena explicação de como funciona a tutoria da Novel Brasil." +
        "Deve ser ressaltado que existem regras e escolhas do tutor/tutorando." +
        "Tudo escrito aqui será baseado nas regras decididas pela Coordenação e devem ser aplicadas durante a interação tutor/tutorando."
    );
  const embed1 = new EmbedBuilder()
    .setColor(redHex)
    .setTitle("Como funcionam as tutorias?")
    .setDescription(
      "A tutoria ocorre com um contato direto entre o tutorando (membro que decidiu fazer sua matrícula) " +
      "e os tutores (membros que já atingiram “classes” mais altas e querem ajudar), " +
      "podendo ocorrer no chat de tutoria (liberado apenas para membros matriculados), " +
      "nas mensagens privadas entre tutor e tutorando, e em calls privadas.\n\n" +
        "Existem três formas de tutoria: tutoria, correção de exercícios e _close reading_ (para tutorando+). " +
        "A tutoria começa em um momento anterior ao encontro tutorando-tutor, o tutorando deve escrever um texto que será avaliado (apontar erros gramaticais e narrativos de acordo com a Classe do tutorando) pelo tutor durante o encontro. " +
        "A correção de exercício foi criada para aqueles estudantes que não podem escrever toda semana, nesses casos serão passadas atividades com o conteúdo da classe. O _close reading_ é um extra para os tutorandos+, o tutor irá ler e comentar sobre seu texto (parecido com um beta reader, mas de forma mais profunda).\n\n" +
        "O conteúdo ministrado durante a tutoria segue uma ordem lógica de conteúdos, onde o estudante estuda desde gramática até narrativa ao decorrer das “classes”."
    );
  const embed2 = new EmbedBuilder()
    .setColor(redHex)
    .setTitle("O que são as Classes?")
    .setDescription(
      "As Classes foram a forma que estruturamos e dividimos o ensinamento do nosso currículo por turmas. "+
      "A Novel Brasil acredita que para o desenvolvimento de um bom escritor é necessário não apenas o conhecimento narrativo, mas também o seu aprimoramento na gramática.\n\n" +

      "Nosso currículo abrange essas duas áreas e as Classes servem nada mais como forma de organizar esses conteúdos e ensinar ao estudante de uma forma didática, "+
      "realista e ordenada. Existem ao total 7 Classes (F, E, D, C, B, A e S) e cada uma possui seus requisitos de entrada e avaliações para sua conclusão.\n\n" +

      "Deve-se deixar claro que as classes não servem para nivelamento de escritores. " +
      "Ter uma Classe maior não significa que sua história é melhor do que a de um autor de Classe menor. " +
      "Usamos as classes como uma forma de saber qual conteúdo o autor está estudando, o que ainda precisa estudar e o que já estudou."
    );

  await channel.send({ embeds: [embedIntro, embed1, embed2] });
};

const buttonFinalMessages = async (channel) => {
  const embed = new EmbedBuilder()
    .setColor(redHex)
    .setTitle("Deseja fazer a matrícula?")
    .setDescription(
      "Agora estamos fazendo a inscrição na tutoria por meio de um formulário, então basta preencher.\n\n" +
        "Por que mudamos? O servidor vem crescendo bastante durante o último ano, chegando ao ponto que não termos tutores o suficiente" +
        "para a quantidade de membros que desejam entrar na tutoria. " +
        "Por causa disso decidimos limitar a quantidade de vagas (20) e abri-las apenas sazonalmente (no começo de cada estação/a cada três meses), " +
        "dessa forma podemos controlar melhor a entrada de novos tutorandos e atender todos.\n\n" +
        "Caso deseje fazer a matrícula, clique no botão abaixo."
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("registration")
      .setLabel("FAZER A MATRÍCULA")
      .setURL("https://forms.gle/mMVGaSrvxxFvr3u49")
      .setStyle(ButtonStyle.Link)
  );

  await channel.send({ embeds: [embed], components: [row] });
};

module.exports = {firstRankMessages, buttonFinalMessages}
