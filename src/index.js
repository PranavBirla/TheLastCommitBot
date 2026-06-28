require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const connectDB = require("./config/database");

const express = require("express");
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

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
    res.render("index", {
        bot: {
            online: client.isReady(),
            ping: client.ws.ping,
            guilds: client.guilds.cache.size,
            members:
                client.guilds.cache.first()?.memberCount || 0
        }
    });
});

app.listen(PORT, () => {
    console.log(`Website is running on ${PORT}`);
});