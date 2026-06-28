const progressCommand = require("../commands/progress");
const Progress = require("../models/Progress");

const {
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const calculateXP = require("../utils/calculateXP");

const { updateLeaderboard } = require("../services/leaderboard.service");

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        // Slash Commands
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === "progress") {
                await progressCommand.execute(interaction);
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === "submit_progress") {
                const modal = new ModalBuilder()
                    .setCustomId("progressModal")
                    .setTitle("Today's Progress");

                const workInput = new TextInputBuilder()
                    .setCustomId("workDone")
                    .setLabel("What did you build today?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const hoursInput = new TextInputBuilder()
                    .setCustomId("hoursWorked")
                    .setLabel("Hours Worked")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const githubInput = new TextInputBuilder()
                    .setCustomId("githubLink")
                    .setLabel("GitHub Link (Optional)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const tomorrowInput = new TextInputBuilder()
                    .setCustomId("tomorrowGoal")
                    .setLabel("Tomorrow's Goal")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(workInput),
                    new ActionRowBuilder().addComponents(hoursInput),
                    new ActionRowBuilder().addComponents(githubInput),
                    new ActionRowBuilder().addComponents(tomorrowInput)
                );

                await interaction.showModal(modal);
            }
        }

        // Modal Submit
        if (interaction.isModalSubmit()) {

            const workDone =
                interaction.fields.getTextInputValue("workDone");

            const hoursWorked =
                interaction.fields.getTextInputValue("hoursWorked");

            const githubLink =
                interaction.fields.getTextInputValue("githubLink");

            const tomorrowGoal =
                interaction.fields.getTextInputValue("tomorrowGoal");

            const earnedXP = calculateXP({
                workDone,
                hoursWorked,
                githubLink
            });

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const existingProgress = await Progress.findOne({
                discordId: interaction.user.id,

                createdAt: {
                    $gte: today,
                    $lt: tomorrow
                }

            });

            if (existingProgress) {
                return interaction.reply({
                    content: "You have already submitted today's progress.",
                    ephemeral: true
                });
            }

            await Progress.create({
                discordId: interaction.user.id,
                username: interaction.user.username,
                workDone,
                hoursWorked,
                githubLink,
                tomorrowGoal
            });

            const User = require("../models/User");

            let user = await User.findOne({
                discordId: interaction.user.id
            });

            if (!user) {
                user = await User.create({
                    discordId: interaction.user.id,
                    username: interaction.user.username,
                    xp: earnedXP,
                    streak: 1,
                    totalProgress: 1,
                    lastProgressDate: new Date()
                });
            }

            else {
                user.username = interaction.user.username;
                user.xp += earnedXP;
                user.totalProgress += 1;
                user.lastProgressDate = new Date();
                await user.save();
            }


            const progressChannel = interaction.guild.channels.cache.get(
                process.env.PROGRESS_CHANNEL_ID
            );

            const progressEmbed = new EmbedBuilder()

                .setColor("#5865F2")

                .setAuthor({
                    name: `${interaction.user.username}'s Daily Progress`,
                    iconURL: interaction.user.displayAvatarURL()
                })

                .setDescription(
                    `━━━━━━━━━━━━━━━━━━━━━━

                    💻 Today's Build
                                    
                    ${workDone}
                                    
                    ━━━━━━━━━━━━━━━━━━━━━━`
                )

                .addFields(

                    {
                        name: "⏰ Hours",
                        value: String(hoursWorked),
                        inline: true
                    },

                    {
                        name: "⭐ XP",
                        value: String(earnedXP),
                        inline: true
                    },

                    {
                        name: "🔥 Streak",
                        value: `${user.streak} Days`,
                        inline: true
                    },
                    {
                        name: "━━━━━━━━━━━━━━━━━━━━━━━",
                        value: "\u200B"
                    },
                    {
                        name: "🎯 Tomorrow's Goal",
                        value: tomorrowGoal
                    }

                )

                .setFooter({
                    text: "Keep Building • Keep Shipping"
                })
                .setTimestamp();


            if (progressChannel) {
                await progressChannel.send({
                    embeds: [progressEmbed]
                });
            }

            await interaction.reply({
                content: "Progress Submitted Successfully!",
                ephemeral: true
            });

            await updateLeaderboard(interaction);

        }

    });

};