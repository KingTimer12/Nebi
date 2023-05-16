module.exports = class DrawModel {
    constructor(interaction, name, type, link, description) {
        this.name = name;
        this.type = type;
        this.link = link;
        this.description = description == '' ? undefined : description;
        this.interaction = interaction;
    }
}