const { loadImage } = require("@napi-rs/canvas");
const Card = require("./Card");

module.exports = class RankCard extends Card {
  constructor() {
    super();
    this.data = {
      width: 934,
      height: 282,
      background: {
        type: "color",
        image: "#23272A",
      },
      progressBar: {
        rounded: true,
        x: 275.5,
        y: 183.75,
        height: 37.5,
        width: 596.5,
        track: {
          color: "#484b4E",
        },
        bar: {
          type: "color",
          color: "#FFFFFF",
        },
      },
      overlay: {
        display: true,
        level: 0.5,
        color: "#333640",
      },
      avatar: {
        source: null,
        x: 70,
        y: 50,
        height: 180,
        width: 180,
      },
      status: {
        width: 5,
        type: "online",
        color: "#43B581",
        circle: false,
      },
      rank: {
        display: true,
        data: 1,
        textColor: "#FFFFFF",
        color: "#F3F3F3",
        displayText: "RANK",
      },
      level: {
        display: true,
        data: 1,
        textColor: "#FFFFFF",
        color: "#F3F3F3",
        displayText: "LEVEL",
      },
      currentXP: {
        data: 0,
        color: "#FFFFFF",
      },
      requiredXP: {
        data: 0,
        color: "#FFFFFF",
      },
      discriminator: {
        discrim: null,
        color: "rgba(255, 255, 255, 0.4)",
      },
      username: {
        name: null,
        color: "#FFFFFF",
      },
      renderEmojis: false,
    };
  }

  renderEmojis(apply = false) {
    this.data.renderEmojis = !!apply;
    return this;
  }

  setFontSize(size) {
    this.data.fontSize = size;
    return this;
  }

  setProgressBar(color, fillType = "COLOR", rounded = true) {
    switch (fillType) {
      case "COLOR":
        if (typeof color !== "string")
          throw new Error(
            `Color type must be a string, received ${typeof color}!`
          );
        this.data.progressBar.bar.color = color;
        this.data.progressBar.bar.type = "color";
        this.data.progressBar.rounded = !!rounded;
        break;
      case "GRADIENT":
        if (!Array.isArray(color))
          throw new Error(
            `Color type must be Array, received ${typeof color}!`
          );
        this.data.progressBar.bar.color = color.slice(0, 2);
        this.data.progressBar.bar.type = "gradient";
        this.data.progressBar.rounded = !!rounded;
        break;
      default:
        throw new Error(`Unsupported progressbar type "${fillType}"!`);
    }

    return this;
  }

  setProgressBarTrack(color) {
    if (typeof color !== "string")
      throw new Error(
        `Color type must be a string, received "${typeof color}"!`
      );
    this.data.progressBar.track.color = color;

    return this;
  }

  setOverlay(color, level = 0.5, display = true) {
    if (typeof color !== "string")
      throw new Error(
        `Color type must be a string, received "${typeof color}"!`
      );
    this.data.overlay.color = color;
    this.data.overlay.display = !!display;
    this.data.overlay.level = level && typeof level === "number" ? level : 0.5;
    return this;
  }

  setRequiredXP(data, color = "#FFFFFF") {
    if (typeof data !== "number")
      throw new Error(
        `Required xp data type must be a number, received ${typeof data}!`
      );
    this.data.requiredXP.data = data;
    this.data.requiredXP.color =
      color && typeof color === "string" ? color : "#FFFFFF";
    return this;
  }

  setRank(data, text = "RANK", display = true) {
    if (typeof data !== "number")
      throw new Error(`Level data must be a number, received ${typeof data}!`);
    this.data.rank.data = data;
    this.data.rank.display = !!display;
    if (!text || typeof text !== "string") text = "RANK";
    this.data.rank.displayText = text;

    return this;
  }

  setRankColor(text = "#FFFFFF", number = "#FFFFFF") {
    if (!text || typeof text !== "string") text = "#FFFFFF";
    if (!number || typeof number !== "string") number = "#FFFFFF";
    this.data.rank.textColor = text;
    this.data.rank.color = number;
    return this;
  }

  setLevelColor(text = "#FFFFFF", number = "#FFFFFF") {
    if (!text || typeof text !== "string") text = "#FFFFFF";
    if (!number || typeof number !== "string") number = "#FFFFFF";
    this.data.level.textColor = text;
    this.data.level.color = number;
    return this;
  }

  setLevel(data, text = "LEVEL", display = true) {
    if (typeof data !== "number")
      throw new Error(`Level data must be a number, received ${typeof data}!`);
    this.data.level.data = data;
    this.data.level.display = !!display;
    if (!text || typeof text !== "string") text = "LEVEL";
    this.data.level.displayText = text;

    return this;
  }

  setCustomStatusColor(color) {
    if (!color || typeof color !== "string") throw new Error("Invalid color!");
    this.data.status.color = color;
    return this;
  }

  setBackground(data) {
    if (!data) throw new Error("Missing field : data");
    this.data.background.type = "image";
    this.data.background.image = data;

    return this;
  }

  async build() {
    if (typeof this.data.currentXP.data !== "number")
      throw new Error(
        `Expected currentXP to be a number, received ${typeof this.data
          .currentXP.data}!`
      );
    if (typeof this.data.requiredXP.data !== "number")
      throw new Error(
        `Expected requiredXP to be a number, received ${typeof this.data
          .requiredXP.data}!`
      );
    if (!this.data.avatar.source) throw new Error("Avatar source not found!");
    if (!this.data.username.name) throw new Error("Missing username");

    //Carregar as imagens antes de tudo
    let bg = await loadImage(this.data.background.image);
    let avatar = await loadImage(this.data.avatar.source);

    //Carregar info default
    super();

    //
    this.ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);

    //Overlay
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "#333640";
    this.ctx.fillRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);

    //Recarregar transparência
    this.ctx.globalAlpha = 1;

    
  }
};
