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

    setAvatar(data) {
        if (!data) throw new Error(`Invalid avatar type "${typeof data}"!`);
        this.data.avatar.source = data;
        return this;
    }

    async build() {
        // create canvas instance
        const canvas = createCanvas(this.data.width, this.data.height);
        this.ctx = canvas.getContext("2d");
    }
}