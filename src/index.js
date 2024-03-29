require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

const { DisTube } = require("distube");

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { DeezerPlugin } = require("@distube/deezer");

const { loadEvents } = require("./handlers/eventHandler");
const { loadButton } = require("./handlers/buttonHandler");
const { loadSelect } = require("./handlers/selectHandler");
const { loadModal } = require("./handlers/modalHandler");

class Bot extends Client {
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

    (async () => {
      this.distube = new DisTube(this, {
        leaveOnEmpty: true,
        leaveOnStop: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        plugins: [
          new SpotifyPlugin({
            emitEventsAfterFetching: true,
          }),
          new SoundCloudPlugin(),
          new YtDlpPlugin(),
          new DeezerPlugin(),
        ],
      });

      this.commands = new Collection();
      this.events = new Collection();
      this.buttons = new Collection();
      this.selects = new Collection();
      this.modals = new Collection();

      require(`./handlers/commands`)(this);
      loadEvents(this);
      loadButton(this);
      loadSelect(this);
      loadModal(this);

      this.login(process.env.BOT_TOKEN);
    })();
  }
}

new Bot();
