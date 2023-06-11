const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

/**
 * Customização do Client para a Nebi
 * @extends {Client}
 */

class Nebi extends Client {
  constructor() {
    super({
      allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true,
      },
      autoReconnect: true,
      disabledEvents: ["TYPING_START"],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.GuildScheduledEvent,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.MessageContent,
      ],
      restTimeOffset: 0,
    });

    this.commands = new Collection();
    this.events = new Collection();
    this.buttons = new Collection();
    this.selects = new Collection();
    this.modals = new Collection();
  }
}
