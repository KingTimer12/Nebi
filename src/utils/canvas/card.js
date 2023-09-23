const { createCanvas } = require("@napi-rs/canvas");

module.exports = class Card {
    constructor() {
        this.data = {
            width: 934,
            height: 282,
            avatar: {
                source: null,
                x: 70,
                y: 50,
                height: 180,
                width: 180
            },
            discriminator: {
                discrim: null,
                color: "rgba(255, 255, 255, 0.4)"
            },
            username: {
                name: null,
                color: "#FFFFFF"
            },
        }
        this.ctx = undefined
    }

    setUsername(name, color = "#FFFFFF") {
        if (typeof name !== "string") throw new Error(`Expected username to be a string, received ${typeof name}!`);
        this.data.username.name = name;
        this.data.username.color = color && typeof color === "string" ? color : "#FFFFFF";
        return this;
    }

    setDiscriminator(discriminator, color = "rgba(255, 255, 255, 0.4)") {
        this.data.discriminator.discrim = !isNaN(discriminator) && `${discriminator}`.length === 4 ? discriminator : null;
        this.data.discriminator.color = color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
        return this;
    }

    setAvatar(data) {
        if (!data) throw new Error(`Invalid avatar type "${typeof data}"!`);
        this.data.avatar.source = data;
        return this;
    }

    async build() {
        // create canvas instance
        this.canvas = createCanvas(this.data.width, this.data.height);
        this.ctx = this.canvas.getContext("2d");
    }
}