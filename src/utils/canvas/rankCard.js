const Card = require("./Card");

module.exports = class RankCard extends Card {

    constructor() {
        super()

    }

    async build() {
        super()

        //Overlay
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#333640';
        this.ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    }
}