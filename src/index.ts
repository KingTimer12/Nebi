import { NebiClient } from "./base/Nebi";
import colors from "./config/colors.json"

export * from "colors";

const client = new NebiClient();
client.start();

export { client, colors }

client.on("ready", () => {
    console.log("Bot online".green)
})