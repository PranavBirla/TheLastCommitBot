const { EmbedBuilder } = require("discord.js");
const User = require("../models/User");

async function updateLeaderboard(interaction) {

    const users = await User.find()
        .sort({ xp: -1 })
        .limit(10);

    const leaderboardChannel =
        interaction.guild.channels.cache.get(
            process.env.LEADERBOARD_CHANNEL_ID
        );

    if (!leaderboardChannel) return;
    let leaderboardText = "";
    users.forEach((user, index) => {
        const medals = ["🥇", "🥈", "🥉"];
        const rank = medals[index] || `#${index + 1}`;
        leaderboardText +=
            `${rank} **${user.username}**

            ⭐ **XP:** ${user.xp}
            🔥 **Streak:** ${user.streak} Day${user.streak > 1 ? "s" : ""}

            ━━━━━━━━━━━━━━━━━━━━━━

    `;
    });


    const leaderboardEmbed = new EmbedBuilder()
        .setColor("#FACC15")
        .setTitle("🏆 Weekly Leaderboard")
        .setDescription(leaderboardText)
        .setFooter({
            text: "The Last Commit"
        })
        .setTimestamp();


    const messages = await leaderboardChannel.messages.fetch({
        limit: 5
    });

    const existingMessage = messages.find(
        msg => msg.author.id === interaction.client.user.id
    );

    if (existingMessage) {
        await existingMessage.edit({
            embeds: [leaderboardEmbed]
        });
    } else {
        await leaderboardChannel.send({
            embeds: [leaderboardEmbed]
        });
    }
}

module.exports = {
    updateLeaderboard
};