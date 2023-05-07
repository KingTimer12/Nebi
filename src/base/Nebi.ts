import { BitFieldResolvable, Client, GatewayIntentsString, IntentsBitField, Partials } from 'discord.js';
import dotenv from "dotenv"
dotenv.config()

export class NebiClient extends Client {
    constructor() {
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [
                Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent,
                Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User
            ]
        })
    }

    public start() {
        this.login(process.env.BOT_TOKEN)
    }
}