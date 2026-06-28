const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

async function createProgressPanel(channel){

    const embed = new EmbedBuilder()
        .setTitle("Daily Progress")
        .setDescription(
`Track your progress every day.
• Earn XP
• Build your streak
• Climb the leaderboard`
        );

    const row = new ActionRowBuilder()

        .addComponents(
            new ButtonBuilder()
                .setCustomId("submit_progress")
                .setLabel("Submit Progress")
                .setStyle(ButtonStyle.Primary)
        );

    await channel.send({
        embeds:[embed],
        components:[row]
    });
}

module.exports = {
    createProgressPanel
};