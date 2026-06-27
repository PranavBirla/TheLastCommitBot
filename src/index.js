require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const connectDB = require("./config/database");

connectDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`${client.user.tag} is online!`);
});

require("./events/messageCreate")(client);
require("./events/interactionCreate")(client);

client.login(process.env.TOKEN);