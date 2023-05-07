import { NebiClient } from "./base/Nebi";
export * from "colors";

const client = new NebiClient();
client.start();
export { client }
client.on("ready", () => {
    console.log("Bot online".green)
})