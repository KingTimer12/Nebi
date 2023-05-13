import { BitFieldResolvable, Client, Collection, GatewayIntentsString, IntentsBitField, Partials } from 'discord.js';
import dotenv from "dotenv"
import { CommandType, ComponentsButton, ComponentsModal, ComponentsSelect } from './types/Command';
dotenv.config()

export class NebiClient extends Client {

    public commands: Collection<string, CommandType> = new Collection();
    public buttons: ComponentsButton = new Collection();
    public selects: ComponentsSelect = new Collection();
    public modals: ComponentsModal = new Collection();

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