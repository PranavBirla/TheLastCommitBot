const { createProgressPanel } = require("./progressPanel.service");

async function setupPanels(client) {

    const channel = await client.channels.fetch(
        process.env.SUBMIT_PROGRESS_CHANNEL_ID
    );

    const messages = await channel.messages.fetch({ limit: 20 });

    const alreadyExists = messages.find(message => {

        return message.author.id === client.user.id &&
            message.components.length > 0;

    });

    if (!alreadyExists) {

        await createProgressPanel(channel);

        console.log("Progress panel created.");

    } else {

        console.log("Progress panel already exists.");

    }

}

module.exports = {
    setupPanels
};