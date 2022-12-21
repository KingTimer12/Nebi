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

discordModals(client);
module.exports = client;

client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
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
