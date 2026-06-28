require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const connectDB = require("./config/database");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
    res.send("The Last Commit Bot is Running");
});

app.listen(PORT, () => {
    console.log(`Health server running on ${PORT}`);
});