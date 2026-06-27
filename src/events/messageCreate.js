module.exports = (client) => {

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;

        if (message.content === "hello") {

            await message.reply("Hello Builder! 🚀");

        }

        if(message.content === "hii") {
            await message.reply(`Hello ${message.author.username} kaise ho?`)
        }
    })

}