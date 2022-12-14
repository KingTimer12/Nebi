require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { loadEvents } = require("./handlers/eventHandler");
const discordModals = require("discord-modals");
const { loadButton } = require("./handlers/buttonHandler");
const { loadSelect } = require("./handlers/selectHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

const { DisTube } = require("distube");

const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { DeezerPlugin } = require("@distube/deezer");

discordModals(client);
module.exports = client;

client.distube = new DisTube(client, {
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

client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.selects = new Collection();

require(`./handlers/commands`)(client);
loadEvents(client);
loadButton(client);
loadSelect(client);

client.login(process.env.BOT_TOKEN);
